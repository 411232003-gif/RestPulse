"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  playTick,
  playWarn,
  playPeakAlert,
  playTimesUp,
  playRewind,
  speakTimesUp,
} from "@/lib/audio";
import { haptics } from "@/lib/haptics";

export type TimerPhase = "calm" | "warning" | "peak";
export type TimerStatus = "idle" | "running" | "paused" | "rewinding";

export interface RestTimerOptions {
  /** total rest duration in seconds (default 60) */
  duration?: number;
  /** seconds before end where the peak (red) phase begins — default 10 */
  peakWindow?: number;
  /** seconds before end where the warning (amber) phase begins — default 15 */
  warnWindow?: number;
  /** rewind spin duration in ms — default 800 */
  rewindMs?: number;
  soundEnabled?: boolean;
  hapticsEnabled?: boolean;
  /** fired after the rewind animation finishes */
  onComplete?: (info: { skipped: boolean; actualSeconds: number }) => void;
  /** fired the moment the countdown hits zero (before rewind) */
  onZero?: () => void;
}

export interface RestTimer {
  status: TimerStatus;
  phase: TimerPhase;
  /** ms elapsed during current countdown */
  elapsedMs: number;
  remainingMs: number;
  remainingSec: number;
  /** 0 → 1 progress of the dial (elapsed/duration) */
  progress: number;
  /** 0 → 1 progress of the rewind spin animation */
  rewindProgress: number;
  durationSec: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  /** abort countdown — straight to rewind then idle */
  skip: () => void;
  reset: () => void;
  setDuration: (sec: number) => void;
}

export function useRestTimer(opts: RestTimerOptions = {}): RestTimer {
  const {
    duration = 60,
    peakWindow = 10,
    warnWindow = 15,
    rewindMs = 800,
    soundEnabled = true,
    hapticsEnabled = true,
    onComplete,
    onZero,
  } = opts;

  const [status, setStatus] = useState<TimerStatus>("idle");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [rewindProgress, setRewindProgress] = useState(0);
  const [durationSec, setDurationSec] = useState(duration);

  // timing refs
  const rafRef = useRef<number>(0);
  const startedAtRef = useRef(0);
  const accumulatedRef = useRef(0);
  const lastWholeSecRef = useRef(-1);
  const firedZeroRef = useRef(false);
  const peakFiredRef = useRef(false);
  const warnFiredRef = useRef(false);
  const skippedRef = useRef(false);

  // keep latest callbacks/enabled flags in refs for the rAF loop
  const optsRef = useRef({ soundEnabled, hapticsEnabled, onComplete, onZero });
  optsRef.current = { soundEnabled, hapticsEnabled, onComplete, onZero };

  const durationMs = durationSec * 1000;

  const phase: TimerPhase =
    status === "idle"
      ? "calm"
      : (() => {
          const remainSec = (durationMs - elapsedMs) / 1000;
          if (remainSec <= peakWindow) return "peak";
          if (remainSec <= warnWindow) return "warning";
          return "calm";
        })();

  const buzz = useCallback((fn: () => void, kind: "sound" | "haptic") => {
    const o = optsRef.current;
    if (kind === "sound" ? o.soundEnabled : o.hapticsEnabled) fn();
  }, []);

  /* ── rewind → onComplete ──────────────────────────────────── */
  const runRewind = useCallback((endElapsedMs: number) => {
    const actualSeconds = Math.min(durationMs, endElapsedMs) / 1000;
    setStatus("rewinding");
    buzz(playRewind, "sound");
    buzz(haptics.rewind, "haptic");

    const t0 = performance.now();
    const spin = (now: number) => {
      const t = Math.min(1, (now - t0) / rewindMs);
      setRewindProgress(t);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(spin);
      } else {
        setElapsedMs(0);
        setRewindProgress(0);
        setStatus("idle");
        optsRef.current.onComplete?.({
          skipped: skippedRef.current,
          actualSeconds: Math.round(actualSeconds),
        });
      }
    };
    rafRef.current = requestAnimationFrame(spin);
  }, [rewindMs, buzz, durationMs]);

  /* ── countdown loop ───────────────────────────────────────── */
  const tick = useCallback(
    (now: number) => {
      const elapsed = accumulatedRef.current + (now - startedAtRef.current);
      setElapsedMs(Math.min(elapsed, durationMs));

      const remaining = durationMs - elapsed;
      const remainSec = Math.ceil(remaining / 1000);
      const wholeSec = Math.floor(elapsed / 1000);

      // per-second cues
      if (wholeSec !== lastWholeSecRef.current && remaining > 0) {
        lastWholeSecRef.current = wholeSec;
        if (remainSec <= 5) {
          buzz(playPeakAlert, "sound");
          buzz(haptics.peak, "haptic");
        } else if (remainSec <= peakWindow) {
          buzz(playPeakAlert, "sound");
          buzz(haptics.warn, "haptic");
        } else if (remainSec <= warnWindow) {
          buzz(playWarn, "sound");
          buzz(haptics.warn, "haptic");
        } else {
          buzz(playTick, "sound");
        }
      }

      // phase-entry haptics (once each)
      if (remainSec <= warnWindow && !warnFiredRef.current) {
        warnFiredRef.current = true;
        buzz(haptics.warn, "haptic");
      }
      if (remainSec <= peakWindow && !peakFiredRef.current) {
        peakFiredRef.current = true;
        buzz(haptics.peak, "haptic");
      }

      if (remaining <= 0) {
        if (!firedZeroRef.current) {
          firedZeroRef.current = true;
          buzz(playTimesUp, "sound");
          buzz(haptics.done, "haptic");
          if (optsRef.current.soundEnabled) speakTimesUp();
          optsRef.current.onZero?.();
        }
        runRewind(durationMs);
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    },
    [durationMs, peakWindow, warnWindow, buzz, runRewind]
  );

  /* ── controls ─────────────────────────────────────────────── */
  const start = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    accumulatedRef.current = 0;
    lastWholeSecRef.current = -1;
    firedZeroRef.current = false;
    peakFiredRef.current = false;
    warnFiredRef.current = false;
    skippedRef.current = false;
    setElapsedMs(0);
    setRewindProgress(0);
    startedAtRef.current = performance.now();
    setStatus("running");
  }, []);

  const pause = useCallback(() => {
    if (status !== "running") return;
    cancelAnimationFrame(rafRef.current);
    accumulatedRef.current += performance.now() - startedAtRef.current;
    setStatus("paused");
  }, [status]);

  const resume = useCallback(() => {
    if (status !== "paused") return;
    startedAtRef.current = performance.now();
    setStatus("running");
  }, [status]);

  const skip = useCallback(() => {
    if (status === "idle" || status === "rewinding") return;
    skippedRef.current = true;
    cancelAnimationFrame(rafRef.current);
    // when paused, startedAt is stale — accumulated already holds true elapsed
    const elapsed =
      accumulatedRef.current +
      (status === "running" ? performance.now() - startedAtRef.current : 0);
    runRewind(elapsed);
  }, [status, runRewind]);

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    accumulatedRef.current = 0;
    lastWholeSecRef.current = -1;
    firedZeroRef.current = false;
    peakFiredRef.current = false;
    warnFiredRef.current = false;
    skippedRef.current = false;
    setElapsedMs(0);
    setRewindProgress(0);
    setStatus("idle");
  }, []);

  const setDuration = useCallback(
    (sec: number) => {
      const clamped = Math.max(5, Math.min(600, Math.round(sec)));
      setDurationSec(clamped);
      if (status === "running" || status === "paused") reset();
    },
    [status, reset]
  );

  /* ── sync duration prop (e.g. profile loads async) ───────── */
  useEffect(() => {
    setDurationSec(Math.max(5, Math.min(600, Math.round(duration))));
  }, [duration]);

  /* ── drive the loop ───────────────────────────────────────── */
  useEffect(() => {
    if (status !== "running") return;
    startedAtRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [status, tick]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const remainingMs = Math.max(0, durationMs - elapsedMs);

  return {
    status,
    phase,
    elapsedMs,
    remainingMs,
    remainingSec: Math.ceil(remainingMs / 1000),
    progress: durationMs > 0 ? Math.min(1, elapsedMs / durationMs) : 0,
    rewindProgress,
    durationSec,
    start,
    pause,
    resume,
    skip,
    reset,
    setDuration,
  };
}
