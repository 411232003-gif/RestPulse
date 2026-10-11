"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Flame,
  History,
  LineChart as LineChartIcon,
  ListChecks,
  Settings,
  Timer,
  TrendingUp,
} from "lucide-react";
import { useWorkoutStore } from "@/store/useWorkoutStore";
import { buildSmoothPath, easedTimeForProgress } from "@/lib/chart";

/**
 * Stats dashboard — adapted from `Analytic-Dashboard--main`.
 * Same structure: rail nav · stat rows · animated glowing SVG chart with
 * tooltips · bottom metrics · water-reflection beneath the card.
 * Re-tinted from purple to the RestPulse volt/cyan palette.
 */

const W = 420;
const H = 220;
const PAD = { l: 6, r: 6, t: 56, b: 10 };

function dayLabel(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", { weekday: "short" });
}

interface ChartPoint {
  label: string;
  v: number;
  v2: number;
}

export default function StatsDashboard() {
  const sets = useWorkoutStore((s) => s.sets);
  const restSessions = useWorkoutStore((s) => s.restSessions);
  const [tip, setTip] = useState<{ x: number; y: number; label: string; val: string } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);

  // last 7 days: volume (kg lifted) + sets count (scaled)
  const data = useMemo<ChartPoint[]>(() => {
    const days: ChartPoint[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      const dayEnd = dayStart + 86400000;
      const daySets = sets.filter((s) => s.timestamp >= dayStart && s.timestamp < dayEnd);
      days.push({
        label: dayLabel(dayStart),
        v: daySets.reduce((sum, s) => sum + s.weightKg * s.reps, 0),
        v2: daySets.length * 1000,
      });
    }
    return days;
  }, [sets]);

  const { mainPath, dimPath, areaPath, pts } = useMemo(() => {
    const maxV = Math.max(1, ...data.map((d) => Math.max(d.v, d.v2))) * 1.05;
    const x = (i: number) => PAD.l + (i / (data.length - 1)) * (W - PAD.l - PAD.r);
    const y = (v: number) => H - PAD.b - (v / maxV) * (H - PAD.t - PAD.b);
    const main = data.map((d, i) => [x(i), y(d.v)] as [number, number]);
    const dim = data.map((d, i) => [x(i), y(d.v2)] as [number, number]);
    const mp = buildSmoothPath(main);
    return {
      mainPath: mp,
      dimPath: buildSmoothPath(dim),
      areaPath: `${mp} L ${main[main.length - 1][0]} ${H - PAD.b} L ${main[0][0]} ${H - PAD.b} Z`,
      pts: main,
    };
  }, [data]);

  // draw-in animation — targets the card AND its reflection copy
  useEffect(() => {
    const paths = rootRef.current?.querySelectorAll<SVGPathElement>(".rp-main-line");
    if (!paths?.length) return;
    paths.forEach((path) => {
      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len}`;
    });
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        paths.forEach((path) => {
          path.style.transition = "stroke-dashoffset 2200ms cubic-bezier(.2,.8,.2,1)";
          path.style.strokeDashoffset = "0";
        });
        setDrawn(true);
      })
    );
    return () => cancelAnimationFrame(raf);
  }, [mainPath]);

  const totalVolume = sets.reduce((sum, s) => sum + s.weightKg * s.reps, 0);
  const weekSets = sets.filter((s) => s.timestamp > Date.now() - 7 * 86400000).length;
  const compliance =
    restSessions.length === 0
      ? 100
      : Math.round(
          (restSessions.filter((r) => !r.skipped).length / restSessions.length) * 100
        );

  const card = (
    <>
      <h1 className="font-display text-center text-[34px] leading-[0.96] tracking-tight text-white mb-6">
        TRAIN WITH
        <br />
        PRECISION.
      </h1>

      <div className="flex gap-5">
        {/* rail nav — ported from the source design */}
        <div className="flex flex-col gap-4 mt-1 py-3 px-1.5 rounded-2xl border border-white/10 bg-white/[0.02] shadow-[inset_0_0_8px_rgba(255,255,255,0.12)]">
          {[Timer, History, LineChartIcon, ListChecks, Settings].map((Icon, i) => (
            <button
              key={i}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all
                ${
                  i === 0
                    ? "text-white bg-gradient-to-b from-volt/60 to-volt/25 shadow-[0_0_16px_rgba(212,255,0,0.5)]"
                    : "text-white/40 hover:text-white hover:bg-white/[0.06]"
                }`}
              aria-label={`Nav ${i}`}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>

        <div className="flex-1 min-w-0">
          {/* stat row */}
          <div className="flex gap-10 mb-1">
            <div>
              <div className="text-xs text-white/50 mb-1">Rest Compliance</div>
              <div className="text-xl font-bold text-white tabular-nums">{compliance}%</div>
            </div>
            <div>
              <div className="text-xs text-white/50 mb-1">Sets / 7d</div>
              <div className="text-xl font-bold text-volt tabular-nums" style={{ textShadow: "0 0 40px rgba(212,255,0,0.6)" }}>
                {weekSets}
              </div>
            </div>
          </div>

          {/* chart */}
          <div className="relative h-[220px] -mx-1">
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="rpArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4FF00" stopOpacity="0.4" />
                  <stop offset="45%" stopColor="#00E5FF" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.05" />
                </linearGradient>
                <filter id="rpGlow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="4" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {pts.map((p, i) => (
                <line
                  key={i}
                  x1={p[0]}
                  x2={p[0]}
                  y1={p[1]}
                  y2={H - PAD.b}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                />
              ))}

              <path d={dimPath} fill="none" stroke="#1d5a66" strokeWidth="2" strokeLinecap="round" />
              <path d={areaPath} fill="url(#rpArea)" />
              <path
                className="rp-main-line"
                d={mainPath}
                fill="none"
                stroke="#D4FF00"
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#rpGlow)"
              />

              {pts.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={p[0]}
                    cy={p[1]}
                    r={i === pts.length - 1 ? 5.5 : 4}
                    fill="#fff"
                    filter="url(#rpGlow)"
                    style={{ opacity: drawn ? 1 : 0, transition: `opacity 150ms linear ${easedTimeForProgress(i / Math.max(1, pts.length - 1)) * 2200}ms` }}
                  />
                  <circle
                    cx={p[0]}
                    cy={p[1]}
                    r="14"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() =>
                      setTip({ x: p[0], y: p[1], label: data[i].label, val: `${Math.round(data[i].v).toLocaleString()} kg` })
                    }
                    onMouseLeave={() => setTip(null)}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      setTip({ x: p[0], y: p[1], label: data[i].label, val: `${Math.round(data[i].v).toLocaleString()} kg` });
                    }}
                    onTouchEnd={() => setTip(null)}
                  />
                </g>
              ))}
            </svg>

            {tip && (
              <div
                className="absolute pointer-events-none -translate-x-1/2 -translate-y-[115%] rounded-lg border border-volt/40 bg-[#0d1418]/95 px-3 py-1.5 text-center whitespace-nowrap shadow-xl z-10"
                style={{ left: `${(tip.x / W) * 100}%`, top: `${(tip.y / H) * 100}%` }}
              >
                <div className="text-[9px] text-white/50">{tip.label}</div>
                <div className="text-[11px] font-bold text-white">{tip.val}</div>
              </div>
            )}
          </div>

          {/* bottom metrics */}
          <div className="flex gap-6 pt-4 mt-1 border-t border-white/[0.07]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-volt" />
              </div>
              <div>
                <div className="text-[11px] text-white/45">Total Volume</div>
                <div className="text-sm font-bold text-white tabular-nums">
                  {Math.round(totalVolume).toLocaleString()} kg
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <Flame className="w-3.5 h-3.5 text-cyber" />
              </div>
              <div>
                <div className="text-[11px] text-white/45">Rest Sessions</div>
                <div className="text-sm font-bold text-white tabular-nums">
                  {restSessions.length} <span className="text-ocean text-xs font-semibold">logged</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div ref={rootRef} className="relative w-full max-w-[520px] mx-auto" style={{ perspective: "1200px" }}>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative rounded-[32px] px-8 pt-9 pb-7 overflow-hidden"
        style={{
          background: `radial-gradient(115% 90% at 14% 0%, rgba(214,255,230,0.14) 0%, rgba(255,255,255,0) 43%),
            radial-gradient(130% 105% at 76% 100%, rgba(212,255,0,0.20) 0%, rgba(212,255,0,0) 58%),
            linear-gradient(180deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.012) 100%)`,
          border: "1.5px solid rgba(200,225,200,0.28)",
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
          boxShadow: "inset 0 0 30px rgba(255,255,255,0.08), 0 10px 42px rgba(0,0,0,0.65), 0 0 24px rgba(212,255,0,0.08)",
        }}
      >
        {/* gradient border sheen */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-[32px] pointer-events-none"
          style={{
            padding: 1,
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.35), rgba(255,255,255,0) 30%, rgba(255,255,255,0) 70%, rgba(212,255,0,0.35))",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
        <Activity className="hidden" />
        {card}
      </motion.div>

      {/* water reflection — mirrors the card straight down, fading like the source */}
      <div
        aria-hidden
        className="relative h-[150px] overflow-hidden pointer-events-none"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.25) 30%, rgba(0,0,0,0) 80%)",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.25) 30%, rgba(0,0,0,0) 80%)",
        }}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 w-[72%] h-[80px] rounded-b-full blur-xl"
          style={{ background: "radial-gradient(ellipse at 58% 0%, rgba(212,255,0,0.4) 0%, rgba(0,229,255,0.15) 45%, transparent 75%)" }}
        />
        <div className="absolute inset-x-0 top-0 scale-y-[-1] origin-top blur-[3px] saturate-150 brightness-90 opacity-70">
          <div className="rounded-[32px] px-8 pt-9 pb-7" style={{ border: "1.5px solid rgba(200,225,200,0.15)" }}>
            {card}
          </div>
        </div>
      </div>
    </div>
  );
}
