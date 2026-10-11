"use client";

import { useState } from "react";
import { Minus, Plus, Check } from "lucide-react";
import type { Exercise, WorkoutSet } from "@/lib/types";
import { useWorkoutStore } from "@/store/useWorkoutStore";
import { haptics } from "@/lib/haptics";
import PhotoUploader from "./PhotoUploader";

function Stepper({
  value,
  onChange,
  step,
  min,
  max,
  unit,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  step: number;
  min: number;
  max: number;
  unit: string;
  label: string;
}) {
  const fmt = (v: number) => (Number.isInteger(step) ? String(v) : v.toFixed(1));
  return (
    <div className="flex-1">
      <div className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-1.5 text-center">
        {label}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            haptics.tap();
            onChange(Math.max(min, +(value - step).toFixed(1)));
          }}
          className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/12 flex items-center justify-center
            text-white/70 hover:bg-white/12 active:scale-90 transition-all"
          aria-label={`Kurangi ${label}`}
        >
          <Minus className="w-5 h-5" />
        </button>
        <div className="flex-1 h-12 rounded-xl bg-black/40 border border-white/10 flex items-baseline justify-center gap-1">
          <span className="font-display text-2xl text-white tabular-nums">{fmt(value)}</span>
          <span className="text-[10px] text-white/40 uppercase">{unit}</span>
        </div>
        <button
          onClick={() => {
            haptics.tap();
            onChange(Math.min(max, +(value + step).toFixed(1)));
          }}
          className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/12 flex items-center justify-center
            text-white/70 hover:bg-white/12 active:scale-90 transition-all"
          aria-label={`Tambah ${label}`}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

/**
 * Weight × reps logger with big thumb-friendly steppers.
 * "Complete Set" persists the set (Firestore/local) and fires onSetDone
 * so the parent can trigger the rest timer.
 */
export default function SetLogger({
  exercise,
  workoutId,
  onSetDone,
}: {
  exercise: Exercise;
  workoutId: string;
  onSetDone: (set: WorkoutSet) => void;
}) {
  const addSet = useWorkoutStore((s) => s.addSet);
  const sets = useWorkoutStore((s) => s.sets);
  const [weight, setWeight] = useState(60);
  const [reps, setReps] = useState(8);
  const [photoUrl, setPhotoUrl] = useState("");

  const setIndex = sets.filter((s) => s.exerciseId === exercise.id).length + 1;

  function complete() {
    haptics.confirm();
    const set: WorkoutSet = {
      id: `set-${Date.now()}`,
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      weightKg: weight,
      reps,
      setIndex,
      restSeconds: 0,
      restCompleted: false,
      photoUrl: photoUrl || undefined,
      timestamp: Date.now(),
    };
    addSet(set);
    setPhotoUrl("");
    onSetDone(set);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">
          Set {setIndex}
        </span>
        <span className="text-[10px] tracking-[0.3em] uppercase text-volt">
          {exercise.name}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Stepper label="Beban" unit="kg" value={weight} onChange={setWeight} step={2.5} min={0} max={500} />
        <Stepper label="Reps" unit="reps" value={reps} onChange={setReps} step={1} min={1} max={100} />
      </div>

      <div className="flex items-center justify-between gap-3">
        <PhotoUploader workoutId={workoutId} onAttached={setPhotoUrl} />
        <button
          onClick={complete}
          className="flex-1 h-14 rounded-2xl bg-ocean text-obsidian font-display tracking-[0.18em] uppercase
            shadow-cyan-glow hover:brightness-110 active:scale-95 transition-all
            flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <Check className="w-5 h-5" strokeWidth={3} />
          Selesai Set
        </button>
      </div>
    </div>
  );
}
