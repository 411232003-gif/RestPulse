"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import type { Exercise } from "@/lib/types";

/**
 * Biomechanical form guide: a stylized mannequin with neon-highlighted
 * target muscles, glowing joint markers, angle callouts, and Do's & Don'ts.
 * Muscles pulse in ocean-cyan; joint cues annotate in volt.
 */

const V = { w: 200, h: 320 };

// front-view mannequin muscle zones per muscleGroup
const MUSCLE_ZONES: Record<string, { cx: number; cy: number; rx: number; ry: number; rot?: number }[]> = {
  Dada: [
    { cx: 84, cy: 102, rx: 15, ry: 11, rot: -12 },
    { cx: 116, cy: 102, rx: 15, ry: 11, rot: 12 },
    { cx: 63, cy: 96, rx: 7, ry: 10, rot: 20 },
    { cx: 137, cy: 96, rx: 7, ry: 10, rot: -20 },
  ],
  Kaki: [
    { cx: 85, cy: 205, rx: 11, ry: 26, rot: 4 },
    { cx: 115, cy: 205, rx: 11, ry: 26, rot: -4 },
    { cx: 88, cy: 262, rx: 7, ry: 20 },
    { cx: 112, cy: 262, rx: 7, ry: 20 },
    { cx: 84, cy: 168, rx: 10, ry: 8, rot: 15 },
    { cx: 116, cy: 168, rx: 10, ry: 8, rot: -15 },
  ],
  "Rantai Posterior": [
    { cx: 84, cy: 170, rx: 12, ry: 9, rot: 15 },
    { cx: 116, cy: 170, rx: 12, ry: 9, rot: -15 },
    { cx: 85, cy: 230, rx: 9, ry: 22, rot: 5 },
    { cx: 115, cy: 230, rx: 9, ry: 22, rot: -5 },
    { cx: 100, cy: 120, rx: 9, ry: 22 },
    { cx: 78, cy: 96, rx: 8, ry: 9, rot: 25 },
    { cx: 122, cy: 96, rx: 8, ry: 9, rot: -25 },
  ],
  Punggung: [
    { cx: 80, cy: 118, rx: 10, ry: 24, rot: 18 },
    { cx: 120, cy: 118, rx: 10, ry: 24, rot: -18 },
    { cx: 60, cy: 130, rx: 6, ry: 18, rot: -12 },
    { cx: 140, cy: 130, rx: 6, ry: 18, rot: 12 },
  ],
  Bahu: [
    { cx: 62, cy: 94, rx: 10, ry: 12, rot: 20 },
    { cx: 138, cy: 94, rx: 10, ry: 12, rot: -20 },
    { cx: 100, cy: 82, rx: 16, ry: 7 },
    { cx: 55, cy: 145, rx: 5, ry: 16 },
    { cx: 145, cy: 145, rx: 5, ry: 16 },
  ],
  Lengan: [
    { cx: 54, cy: 138, rx: 6, ry: 17, rot: -8 },
    { cx: 146, cy: 138, rx: 6, ry: 17, rot: 8 },
    { cx: 50, cy: 182, rx: 5, ry: 15 },
    { cx: 150, cy: 182, rx: 5, ry: 15 },
  ],
};

// joint marker positions on the mannequin
const JOINT_POS: Record<string, { x: number; y: number }> = {
  Siku: { x: 52, y: 156 },
  Pergelangan: { x: 48, y: 205 },
  Bahu: { x: 64, y: 92 },
  Pinggul: { x: 100, y: 172 },
  Lutut: { x: 86, y: 246 },
  "Mata kaki": { x: 88, y: 300 },
  Punggung: { x: 100, y: 128 },
};

function Mannequin({ muscleGroup }: { muscleGroup: string }) {
  const zones = MUSCLE_ZONES[muscleGroup] ?? MUSCLE_ZONES["Dada"];
  return (
    <svg viewBox={`0 0 ${V.w} ${V.h}`} className="w-full h-full">
      <defs>
        <filter id="muscleGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.14)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
        </linearGradient>
      </defs>

      {/* body silhouette (stylized line mannequin) */}
      <g stroke="rgba(255,255,255,0.35)" strokeWidth="2" fill="url(#bodyGrad)">
        <circle cx="100" cy="48" r="20" />
        {/* torso */}
        <path d="M 78 82 Q 100 74 122 82 L 118 160 Q 100 172 82 160 Z" />
        {/* left arm */}
        <path d="M 76 86 Q 56 96 54 130 L 50 178 Q 48 198 46 210 L 56 212 Q 60 190 62 172 L 66 132 Q 68 110 78 96" />
        {/* right arm */}
        <path d="M 124 86 Q 144 96 146 130 L 150 178 Q 152 198 154 210 L 144 212 Q 140 190 138 172 L 134 132 Q 132 110 122 96" />
        {/* left leg */}
        <path d="M 84 164 Q 78 200 82 240 L 84 296 L 96 296 L 96 244 Q 96 206 98 176" />
        {/* right leg */}
        <path d="M 116 164 Q 122 200 118 240 L 116 296 L 104 296 L 104 244 Q 104 206 102 176" />
      </g>

      {/* highlighted muscle zones — pulsing cyan */}
      {zones.map((z, i) => (
        <motion.ellipse
          key={i}
          cx={z.cx}
          cy={z.cy}
          rx={z.rx}
          ry={z.ry}
          transform={z.rot ? `rotate(${z.rot} ${z.cx} ${z.cy})` : undefined}
          fill="rgba(0,229,255,0.30)"
          stroke="#00E5FF"
          strokeWidth="1.4"
          filter="url(#muscleGlow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </svg>
  );
}

export default function FormGuideOverlay({ exercise }: { exercise: Exercise }) {
  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-5">
      {/* mannequin panel */}
      <div className="relative mx-auto w-full max-w-[220px] aspect-[200/320] rounded-2xl border border-white/10 bg-black/30 overflow-hidden">
        {/* scan-line texture */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, #00E5FF 3px, #00E5FF 4px)",
          }}
        />
        <Mannequin muscleGroup={exercise.muscleGroup} />
        <div className="absolute top-2 left-2 text-[9px] tracking-[0.3em] text-ocean/70 uppercase">
          Pindai Form
        </div>
      </div>

      {/* cues + dos/donts */}
      <div className="space-y-4 min-w-0">
        <div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-2">
            Sudut Sendi
          </div>
          <div className="grid gap-2">
            {exercise.formCues.map((c) => {
              const pos = JOINT_POS[c.joint];
              return (
                <div
                  key={c.joint}
                  className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2"
                >
                  <span className="w-2 h-2 rounded-full bg-volt shadow-[0_0_8px_#D4FF00] shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-volt tracking-wide">
                      {c.joint} · {c.angle}
                    </span>
                    <p className="text-xs text-white/55 truncate">{c.note}</p>
                  </div>
                  {pos && <span className="sr-only">{`joint at ${pos.x},${pos.y}`}</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-ocean/20 bg-ocean/[0.05] p-3">
            <div className="text-[10px] tracking-[0.25em] uppercase text-ocean mb-2">Lakukan</div>
            <ul className="space-y-1.5">
              {exercise.dos.map((d) => (
                <li key={d} className="flex gap-1.5 text-[11px] leading-snug text-white/70">
                  <Check className="w-3 h-3 mt-0.5 shrink-0 text-ocean" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-infra/25 bg-infra/[0.05] p-3">
            <div className="text-[10px] tracking-[0.25em] uppercase text-infra mb-2">Jangan</div>
            <ul className="space-y-1.5">
              {exercise.donts.map((d) => (
                <li key={d} className="flex gap-1.5 text-[11px] leading-snug text-white/70">
                  <X className="w-3 h-3 mt-0.5 shrink-0 text-infra" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
