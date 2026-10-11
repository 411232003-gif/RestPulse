"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { RestTimer, TimerPhase } from "@/hooks/useRestTimer";

const PHASE_COLOR: Record<TimerPhase, string> = {
  calm: "#00E5FF",
  warning: "#FFB800",
  peak: "#FF2E55",
};

const PHASE_LABEL: Record<TimerPhase, string> = {
  calm: "RECOVER",
  warning: "GET READY",
  peak: "GO!",
};

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = polar(cx, cy, r, startDeg);
  const e = polar(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

interface Props {
  timer: RestTimer;
  size?: number;
}

export default function AnalogClock({ timer, size = 340 }: Props) {
  const { progress, phase, remainingSec, status, rewindProgress, durationSec } = timer;

  const C = 200;
  const R_ARC = 148;
  const R_TICK_OUT = 184;
  const color = PHASE_COLOR[phase];

  // hand angle: 0→360 as time elapses; during rewind spins back with extra turns
  const elapsedAngle = progress * 360;
  const eased = easeInOutCubic(rewindProgress);
  const handAngle =
    status === "rewinding" ? elapsedAngle - (elapsedAngle + 720) * eased : elapsedAngle;
  const arcProgress = status === "rewinding" ? progress * (1 - eased) : progress;
  const arcEnd = Math.max(0.0001, arcProgress * 360);

  const ticks = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => {
      const major = i % 5 === 0;
      const outer = polar(C, C, R_TICK_OUT, i * 6);
      const inner = polar(C, C, R_TICK_OUT - (major ? 16 : 9), i * 6);
      // ticks ahead of the hand (already "spent") glow with the phase color
      const spent = i * 6 < arcEnd;
      return { i, major, outer, inner, spent };
    });
  }, [arcEnd]);

  const handTip = polar(C, C, R_ARC, handAngle);
  const handTail = polar(C, C, 26, handAngle + 180);

  const mm = Math.floor(remainingSec / 60);
  const ss = String(remainingSec % 60).padStart(2, "0");

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* ambient aura */}
      <motion.div
        className="absolute -inset-10 rounded-full pointer-events-none"
        animate={{
          background: `radial-gradient(circle, ${color}33 0%, ${color}14 45%, transparent 70%)`,
        }}
        transition={{ duration: 0.8 }}
        style={{ filter: "blur(28px)" }}
      />
      {phase === "peak" && status === "running" && (
        <motion.div
          className="absolute -inset-6 rounded-full pointer-events-none"
          animate={{ opacity: [0.35, 0.85, 0.35], scale: [1, 1.04, 1] }}
          transition={{ duration: 0.55, repeat: Infinity }}
          style={{
            background: `radial-gradient(circle, transparent 55%, ${color}55 80%, transparent 100%)`,
            filter: "blur(10px)",
          }}
        />
      )}

      {/* glass dial body */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(120% 120% at 30% 20%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 45%, rgba(0,0,0,0.4) 100%), linear-gradient(180deg, rgba(30,37,48,0.9), rgba(13,16,22,0.95))",
          border: "1.5px solid rgba(255,255,255,0.14)",
          boxShadow: `inset 0 2px 6px rgba(255,255,255,0.12), inset 0 -14px 30px rgba(0,0,0,0.55), 0 24px 60px rgba(0,0,0,0.6), 0 0 ${phase === "peak" ? 70 : 40}px ${color}44`,
          transition: "box-shadow 0.6s ease",
        }}
      />

      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
        <defs>
          <filter id="clockGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="handGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>

        {/* tick marks */}
        {ticks.map((t) => (
          <line
            key={t.i}
            x1={t.inner.x}
            y1={t.inner.y}
            x2={t.outer.x}
            y2={t.outer.y}
            stroke={t.spent ? color : "rgba(255,255,255,0.18)"}
            strokeWidth={t.major ? 3.5 : 1.6}
            strokeLinecap="round"
            style={{ transition: "stroke 0.25s ease" }}
          />
        ))}

        {/* cardinal labels */}
        {[0, 15, 30, 45].map((sec) => {
          const p = polar(C, C, 122, (sec / 60) * 360);
          return (
            <text
              key={sec}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(255,255,255,0.4)"
              fontSize="13"
              fontWeight="600"
              style={{ letterSpacing: "0.08em" }}
            >
              {sec === 0 ? "60" : sec}
            </text>
          );
        })}

        {/* elapsed arc */}
        {arcEnd > 0.5 && (
          <path
            d={describeArc(C, C, R_ARC, 0, arcEnd)}
            fill="none"
            stroke={color}
            strokeWidth="13"
            strokeLinecap="round"
            filter="url(#clockGlow)"
            style={{ transition: "stroke 0.6s ease" }}
          />
        )}

        {/* hand tail + main hand */}
        <line
          x1={handTail.x}
          y1={handTail.y}
          x2={handTip.x}
          y2={handTip.y}
          stroke="url(#handGrad)"
          strokeWidth="5"
          strokeLinecap="round"
          filter="url(#clockGlow)"
        />
        <circle cx={handTip.x} cy={handTip.y} r="7" fill={color} filter="url(#clockGlow)" />

        {/* center hub */}
        <circle cx={C} cy={C} r="14" fill="#0B0E14" stroke={color} strokeWidth="3" filter="url(#clockGlow)" />
      </svg>

      {/* center digital readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div
          className="font-display tabular-nums leading-none"
          style={{
            fontSize: size * 0.19,
            color: "#fff",
            textShadow: `0 0 30px ${color}88`,
            transform: "translateY(12px)",
            transition: "text-shadow 0.5s ease",
          }}
        >
          {status === "idle" ? `${durationSec}s` : `${mm}:${ss}`}
        </div>
        <div
          className="uppercase font-semibold"
          style={{
            color,
            fontSize: size * 0.038,
            letterSpacing: "0.35em",
            transform: "translateY(18px)",
            transition: "color 0.5s ease",
          }}
        >
          {status === "running" || status === "paused" ? PHASE_LABEL[phase] : status === "rewinding" ? "REWIND" : "REST PULSE"}
        </div>
      </div>
    </div>
  );
}
