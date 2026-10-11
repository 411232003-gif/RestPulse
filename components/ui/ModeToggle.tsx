"use client";

import { useMemo, useState, useEffect } from "react";
import { Zap, Moon } from "lucide-react";
import { haptics } from "@/lib/haptics";
import styles from "./ModeToggle.module.css";

/**
 * Animated dual-mode switch — adapted from `button dua mode`.
 * OFF = MANUAL rest (volt sun + clouds) · ON = AUTO rest (cyan night, stars, moon).
 */
export default function ModeToggle({
  on,
  onChange,
  offLabel = "Rest Manual",
  onLabel = "Rest Otomatis",
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  offLabel?: string;
  onLabel?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const stars = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        key: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3,
      })),
    []
  );

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <div className={styles.label}>
        <span className={!on ? styles.visible : ""}>{offLabel}</span>
        <span className={on ? styles.visible : ""}>{onLabel}</span>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={`Ganti mode istirahat: ${on ? onLabel : offLabel}`}
        className={`${styles.switch} ${on ? styles.on : ""}`}
        onClick={() => {
          haptics.tap();
          onChange(!on);
        }}
      >
        <div className={styles.track}>
          {mounted && (
            <div className={styles.stars}>
              {stars.map((s) => (
                <span
                  key={s.key}
                  style={{ left: `${s.left}%`, top: `${s.top}%`, animationDelay: `${s.delay}s` }}
                />
              ))}
            </div>
          )}

          <div className={styles.shootingWrap}>
            <span className={`${styles.shooting} ${styles.s1}`} />
            <span className={`${styles.shooting} ${styles.s2}`} />
            <span className={`${styles.shooting} ${styles.s3}`} />
          </div>

          <div className={styles.moon}>
            <Moon size={24} fill="#cfe8ff" color="#cfe8ff" strokeWidth={1} />
          </div>
          <div className={styles.sun} />

          <div className={styles.clouds}>
            <div className={styles.cloudTrack}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/cloud2.png" alt="" aria-hidden draggable={false} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/cloud2.png" alt="" aria-hidden draggable={false} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/cloud2.png" alt="" aria-hidden draggable={false} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/cloud2.png" alt="" aria-hidden draggable={false} />
            </div>
          </div>
        </div>

        <div className={styles.knob}>
          {on ? <Moon strokeWidth={2.5} /> : <Zap strokeWidth={2.5} />}
        </div>
      </button>
    </div>
  );
}
