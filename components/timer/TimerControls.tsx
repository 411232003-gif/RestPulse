"use client";

import { Pause, Play, SkipForward, RotateCcw } from "lucide-react";
import type { RestTimer } from "@/hooks/useRestTimer";
import { haptics } from "@/lib/haptics";

const PRESETS = [30, 45, 60, 90, 120];

export default function TimerControls({ timer }: { timer: RestTimer }) {
  const { status, durationSec, start, pause, resume, skip, setDuration } = timer;

  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-5">
      {/* duration presets — only while idle */}
      {status === "idle" && (
        <div className="flex items-center gap-2">
          {PRESETS.map((s) => (
            <button
              key={s}
              onClick={() => {
                haptics.tap();
                setDuration(s);
              }}
              className={`min-w-[46px] h-11 px-1 rounded-xl font-display text-sm tracking-wider transition-all duration-200 border
                ${
                  durationSec === s
                    ? "bg-volt text-obsidian border-volt shadow-volt-glow"
                    : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white"
                }`}
            >
              {s}s
            </button>
          ))}
        </div>
      )}

      {/* primary controls */}
      <div className="flex items-center gap-4">
        {status === "idle" && (
          <button
            onClick={() => {
              haptics.confirm();
              start();
            }}
            className="h-16 px-10 rounded-2xl bg-volt text-obsidian font-display text-lg tracking-[0.2em] uppercase
              shadow-volt-glow hover:brightness-110 active:scale-95 transition-all flex items-center gap-3"
          >
            <Play className="w-6 h-6" fill="currentColor" />
            Start Rest
          </button>
        )}

        {status === "running" && (
          <>
            <button
              onClick={() => {
                haptics.tap();
                pause();
              }}
              className="h-16 px-8 rounded-2xl bg-cyber text-obsidian font-display text-lg tracking-[0.2em] uppercase
                shadow-amber-glow hover:brightness-110 active:scale-95 transition-all flex items-center gap-3"
            >
              <Pause className="w-6 h-6" fill="currentColor" />
              Pause
            </button>
            <button
              onClick={() => {
                haptics.tap();
                skip();
              }}
              className="h-16 w-16 rounded-2xl bg-white/8 border border-white/15 text-white/80
                hover:bg-white/15 active:scale-95 transition-all flex items-center justify-center"
              aria-label="Skip rest"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </>
        )}

        {status === "paused" && (
          <>
            <button
              onClick={() => {
                haptics.tap();
                resume();
              }}
              className="h-16 px-8 rounded-2xl bg-ocean text-obsidian font-display text-lg tracking-[0.2em] uppercase
                shadow-cyan-glow hover:brightness-110 active:scale-95 transition-all flex items-center gap-3"
            >
              <Play className="w-6 h-6" fill="currentColor" />
              Resume
            </button>
            <button
              onClick={() => {
                haptics.tap();
                skip();
              }}
              className="h-16 w-16 rounded-2xl bg-white/8 border border-white/15 text-white/80
                hover:bg-white/15 active:scale-95 transition-all flex items-center justify-center"
              aria-label="Skip rest"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {status !== "idle" && (
        <div className="text-white/40 text-xs tracking-[0.3em] uppercase flex items-center gap-2">
          <RotateCcw className="w-3 h-3" />
          {status === "rewinding" ? "Back to the set" : "Rest in progress"}
        </div>
      )}
    </div>
  );
}
