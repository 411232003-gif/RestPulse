"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell,
  Flame,
  Vibrate,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";

import AnalogClock from "@/components/timer/AnalogClock";
import TimerControls from "@/components/timer/TimerControls";
import RewindEffect from "@/components/timer/RewindEffect";
import GlassCard from "@/components/ui/GlassCard";
import ModeToggle from "@/components/ui/ModeToggle";
import Iso3DButton from "@/components/ui/Iso3DButton";
import ExerciseCard from "@/components/workout/ExerciseCard";
import FormGuideOverlay from "@/components/workout/FormGuideOverlay";
import SetLogger from "@/components/workout/SetLogger";
import StatsDashboard from "@/components/stats/StatsDashboard";

import { useRestTimer } from "@/hooks/useRestTimer";
import { useWorkoutStore } from "@/store/useWorkoutStore";
import { EXERCISES, getExercise } from "@/lib/exercises";
import { backendLabel } from "@/lib/data";
import { unlockAudio } from "@/lib/audio";
import type { WorkoutSet } from "@/lib/types";

export default function Home() {
  const {
    profile,
    sets,
    hydrated,
    hydrate,
    updateProfile,
    addRestSession,
    updateSet,
    activeExerciseId,
    setActiveExercise,
  } = useWorkoutStore();

  const [workoutId] = useState(() => `workout-${Date.now()}`);
  const clockRef = useRef<HTMLDivElement>(null);

  // responsive clock — never wider than the viewport minus padding
  const [clockSize, setClockSize] = useState(330);
  useEffect(() => {
    const compute = () =>
      setClockSize(Math.max(240, Math.min(330, window.innerWidth - 80)));
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const activeExercise = useMemo(
    () => getExercise(activeExerciseId ?? EXERCISES[0].id)!,
    [activeExerciseId]
  );

  const timer = useRestTimer({
    duration: profile.defaultRestSeconds,
    soundEnabled: profile.soundEnabled,
    hapticsEnabled: profile.hapticsEnabled,
    onComplete: ({ skipped, actualSeconds }) => {
      addRestSession({
        id: `rest-${Date.now()}`,
        exerciseName: activeExercise.name,
        plannedSeconds: timer.durationSec,
        actualSeconds,
        skipped,
        timestamp: Date.now(),
      });
      // mark most recent set's rest as completed
      const lastSet = [...sets].reverse().find((s) => s.exerciseId === activeExercise.id && !s.restCompleted);
      if (lastSet) updateSet({ ...lastSet, restCompleted: !skipped, restSeconds: actualSeconds });
    },
  });

  // keep the screen awake while a rest countdown is running
  useEffect(() => {
    if (timer.status !== "running") return;
    let lock: { release: () => Promise<void> } | null = null;
    const nav = navigator as Navigator & {
      wakeLock?: { request: (t: string) => Promise<{ release: () => Promise<void> }> };
    };
    const acquire = () => {
      nav.wakeLock?.request("screen").then((l) => (lock = l)).catch(() => {});
    };
    acquire();
    document.addEventListener("visibilitychange", acquire);
    return () => {
      document.removeEventListener("visibilitychange", acquire);
      void lock?.release().catch(() => {});
    };
  }, [timer.status]);

  function handleSetDone(_set: WorkoutSet) {
    if (profile.autoRest) {
      unlockAudio();
      timer.start();
      clockRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  const recentSets = useMemo(() => [...sets].sort((a, b) => b.timestamp - a.timestamp).slice(0, 8), [sets]);

  return (
    <main className="relative z-[1] min-h-screen px-4 pb-24 max-w-6xl mx-auto">
      {/* ── header ─────────────────────────────────────────── */}
      <header className="flex items-center justify-between py-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl overflow-hidden border border-volt/40 shadow-volt-glow shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/icon-192.png" alt="Logo RestPulse" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="font-display text-lg tracking-[0.25em] leading-none">
              REST<span className="text-volt">PULSE</span>
            </div>
            <div className="text-[9px] tracking-[0.35em] text-white/35 uppercase mt-1">
              Timer Gym & Istirahat
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-[9px] tracking-[0.25em] uppercase text-white/35 border border-white/10 rounded-full px-3 py-1.5">
            Sinkron {hydrated ? backendLabel() : "…"}
          </span>
          <button
            onClick={() => updateProfile({ soundEnabled: !profile.soundEnabled })}
            aria-label="Suara"
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all
              ${profile.soundEnabled ? "border-ocean/40 text-ocean bg-ocean/10" : "border-white/10 text-white/35"}`}
          >
            {profile.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={() => updateProfile({ hapticsEnabled: !profile.hapticsEnabled })}
            aria-label="Getar"
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all
              ${profile.hapticsEnabled ? "border-volt/40 text-volt bg-volt/10" : "border-white/10 text-white/35"}`}
          >
            <Vibrate className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── hero: analog rest timer ────────────────────────── */}
      <section ref={clockRef} className="flex flex-col items-center py-8 scroll-mt-6">
        <div className="relative">
          <AnalogClock timer={timer} size={clockSize} />
          <RewindEffect active={timer.status === "rewinding"} size={clockSize} color={timer.phase === "peak" ? "#FF2E55" : "#00E5FF"} />
        </div>

        <div className="mt-8">
          <TimerControls timer={timer} />
        </div>

        <div className="mt-10">
          <ModeToggle
            on={profile.autoRest}
            onChange={(v) => updateProfile({ autoRest: v })}
          />
        </div>

        {/* isometric CTA — quick start a rest without logging */}
        {timer.status === "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 mb-4"
          >
            <Iso3DButton
              variant="volt"
              icon={<Zap />}
              label="Rest Cepat"
              sublabel={`${timer.durationSec} detik`}
              onClick={() => {
                unlockAudio();
                timer.start();
              }}
            />
          </motion.div>
        )}
      </section>

      {/* ── workout section ────────────────────────────────── */}
      <section className="grid lg:grid-cols-[340px_1fr] gap-5 mt-4">
        {/* exercise picker */}
        <GlassCard accent="#00E5FF" className="space-y-2.5" padded>
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-display text-sm tracking-[0.25em] uppercase text-white/80 flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-ocean" />
              Latihan
            </h2>
            <span className="text-[10px] text-white/35 tracking-widest">{EXERCISES.length}</span>
          </div>
          {EXERCISES.map((ex) => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              active={activeExercise.id === ex.id}
              onSelect={setActiveExercise}
            />
          ))}
        </GlassCard>

        {/* logger + form guide */}
        <div className="space-y-5">
          <GlassCard accent="#D4FF00">
            <SetLogger exercise={activeExercise} workoutId={workoutId} onSetDone={handleSetDone} />
          </GlassCard>

          <GlassCard accent="#00E5FF">
            <h2 className="font-display text-sm tracking-[0.25em] uppercase text-white/80 mb-4">
              Panduan Form · <span className="text-ocean">{activeExercise.name}</span>
            </h2>
            <FormGuideOverlay exercise={activeExercise} />
          </GlassCard>
        </div>
      </section>

      {/* ── stats dashboard ────────────────────────────────── */}
      <section className="mt-16">
        <StatsDashboard />
      </section>

      {/* ── recent sets ────────────────────────────────────── */}
      <AnimatePresence>
        {recentSets.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-14"
          >
            <h2 className="font-display text-sm tracking-[0.25em] uppercase text-white/70 mb-4 flex items-center gap-2">
              <Flame className="w-4 h-4 text-cyber" />
              Set Terakhir
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {recentSets.map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 relative overflow-hidden"
                >
                  {s.photoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.photoUrl}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-25"
                    />
                  )}
                  <div className="relative">
                    <div className="text-xs font-semibold text-white truncate">{s.exerciseName}</div>
                    <div className="font-display text-xl text-volt tabular-nums mt-1">
                      {s.weightKg}kg × {s.reps}
                    </div>
                    <div className="text-[10px] text-white/35 mt-1 flex items-center justify-between">
                      <span>Set {s.setIndex}</span>
                      <span className={s.restCompleted ? "text-ocean" : "text-white/35"}>
                        {s.restCompleted ? `istirahat ${s.restSeconds}d` : "tanpa istirahat"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
