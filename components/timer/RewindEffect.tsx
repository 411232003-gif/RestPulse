"use client";

import { motion, AnimatePresence } from "framer-motion";

/**
 * Overlay shown while the clock performs its 3D rewind spin —
 * radial motion streaks + a counter-rotating ghost ring.
 */
export default function RewindEffect({
  active,
  size = 340,
  color = "#00E5FF",
}: {
  active: boolean;
  size?: number;
  color?: string;
}) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-20"
          style={{ width: size, height: size }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
        >
          {/* counter-rotating ghost ring */}
          <motion.div
            className="absolute rounded-full"
            style={{
              inset: size * 0.06,
              border: `2px dashed ${color}66`,
            }}
            animate={{ rotate: -540, scale: [1, 0.96, 1] }}
            transition={{ duration: 0.8, ease: [0.6, 0, 0.2, 1] }}
          />
          {/* radial streaks — each anchored at the clock center, rotating
             backwards; framer owns the transform so no style conflict */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-0 w-[2px] -ml-[1px]"
              style={{
                height: size * 0.5,
                transformOrigin: "50% 100%",
                background: `linear-gradient(to top, ${color}00 55%, ${color}aa)`,
              }}
              initial={{ opacity: 0, rotate: i * 30 }}
              animate={{ opacity: [0, 0.9, 0], rotate: [i * 30, i * 30 - 60] }}
              transition={{ duration: 0.7, delay: i * 0.012, ease: "easeOut" }}
            />
          ))}
          {/* flash */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: `radial-gradient(circle, ${color}44, transparent 65%)` }}
            initial={{ opacity: 0.8, scale: 0.7 }}
            animate={{ opacity: 0, scale: 1.25 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
