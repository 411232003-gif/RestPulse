"use client";

/**
 * Web Audio API synthesizers for RestPulse alerts.
 * No audio assets needed — everything is synthesized.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Call once from a user gesture to unlock audio on iOS/Android. */
export function unlockAudio() {
  getCtx();
}

function beep(
  freq: number,
  startAt: number,
  duration: number,
  type: OscillatorType = "sine",
  peak = 0.22
) {
  const ac = getCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startAt);
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(peak, startAt + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(startAt);
  osc.stop(startAt + duration + 0.05);
}

/** Soft tick every second during calm phase. */
export function playTick() {
  const ac = getCtx();
  if (!ac) return;
  beep(880, ac.currentTime, 0.06, "sine", 0.06);
}

/** Amber warning pulse (45s+). */
export function playWarn() {
  const ac = getCtx();
  if (!ac) return;
  const t = ac.currentTime;
  beep(660, t, 0.09, "triangle", 0.12);
  beep(880, t + 0.1, 0.09, "triangle", 0.12);
}

/** Peak alert — final seconds. Sharp rising alarm. */
export function playPeakAlert() {
  const ac = getCtx();
  if (!ac) return;
  const t = ac.currentTime;
  for (let i = 0; i < 3; i++) {
    beep(1200 + i * 200, t + i * 0.12, 0.1, "square", 0.1);
  }
}

/** "Time's up!" — energetic two-note chime when rest completes. */
export function playTimesUp() {
  const ac = getCtx();
  if (!ac) return;
  const t = ac.currentTime;
  // bright major-third hit + shimmer
  beep(523.25, t, 0.18, "triangle", 0.25);
  beep(659.25, t + 0.05, 0.2, "triangle", 0.22);
  beep(784.0, t + 0.12, 0.3, "sine", 0.2);
  beep(1046.5, t + 0.2, 0.4, "sine", 0.14);
}

/** Spoken-style cue fallback via SpeechSynthesis ("Back to the set!"). */
export function speakTimesUp(text = "Time's up! Back to the set!") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.1;
    u.pitch = 1.05;
    u.volume = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {
    /* speech not available — audio cue already played */
  }
}

/** Whoosh for the rewind spin effect. */
export function playRewind() {
  const ac = getCtx();
  if (!ac) return;
  const t = ac.currentTime;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(1600, t);
  osc.frequency.exponentialRampToValueAtTime(160, t + 0.55);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.1, t + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + 0.65);
}
