"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Glassmorphic card adapted from the Analytic-Dashboard design:
 * radial white highlight top-left, ambient accent wash bottom-right,
 * gradient border mask, backdrop blur, rise-in animation.
 */
export default function GlassCard({
  children,
  accent = "#D4FF00",
  className = "",
  padded = true,
}: {
  children: ReactNode;
  /** ambient accent color pooled in the bottom-right corner */
  accent?: string;
  className?: string;
  padded?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      className={`relative rounded-[28px] overflow-hidden ${padded ? "p-6" : ""} ${className}`}
      style={{
        background: `radial-gradient(115% 90% at 14% 0%, rgba(214,255,255,0.10) 0%, rgba(255,255,255,0) 43%),
          radial-gradient(130% 105% at 76% 100%, ${accent}2e 0%, ${accent}00 58%),
          linear-gradient(180deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.012) 100%)`,
        border: "1.5px solid rgba(200,220,255,0.18)",
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.10), 0 10px 42px rgba(0,0,0,0.65), 0 0 24px ${accent}18`,
      }}
    >
      {/* gradient border sheen — same mask-composite trick as the source design */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-[28px] pointer-events-none"
        style={{
          padding: 1,
          background: `linear-gradient(160deg, rgba(255,255,255,0.35), rgba(255,255,255,0) 30%, rgba(255,255,255,0) 70%, ${accent}66)`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      {children}
    </motion.div>
  );
}
