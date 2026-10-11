"use client";

import { motion } from "framer-motion";
import { Dumbbell } from "lucide-react";
import type { Exercise } from "@/lib/types";
import { haptics } from "@/lib/haptics";

export default function ExerciseCard({
  exercise,
  active,
  onSelect,
}: {
  exercise: Exercise;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <motion.button
      layout
      onClick={() => {
        haptics.tap();
        onSelect(exercise.id);
      }}
      whileTap={{ scale: 0.97 }}
      className={`relative w-full text-left rounded-2xl p-4 border transition-all duration-300 overflow-hidden
        ${
          active
            ? "border-volt/60 bg-volt/[0.07] shadow-volt-glow"
            : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
        }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border transition-colors
            ${active ? "bg-volt/15 border-volt/40 text-volt" : "bg-white/5 border-white/10 text-white/50"}`}
        >
          <Dumbbell className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className={`font-display tracking-wide truncate ${active ? "text-volt" : "text-white"}`}>
              {exercise.name}
            </h3>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 shrink-0">
              {exercise.muscleGroup}
            </span>
          </div>
          <p className="text-xs text-white/45 mt-0.5 truncate">{exercise.equipment}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {exercise.targetMuscles.slice(0, 3).map((m) => (
              <span
                key={m}
                className={`text-[10px] px-2 py-0.5 rounded-full border
                  ${active ? "border-ocean/40 text-ocean" : "border-white/10 text-white/40"}`}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {active && (
        <motion.div
          layoutId="exercise-glow"
          className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-volt to-transparent"
        />
      )}
    </motion.button>
  );
}
