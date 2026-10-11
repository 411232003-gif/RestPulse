"use client";

/** Haptic feedback via navigator.vibrate (Android/PWA). iOS Safari ignores it — fine. */

function vibrate(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      /* unsupported */
    }
  }
}

export const haptics = {
  /** light tap — button presses */
  tap: () => vibrate(12),
  /** medium confirm — set logged */
  confirm: () => vibrate([20, 40, 20]),
  /** amber phase warning pulse */
  warn: () => vibrate([60, 60, 60]),
  /** peak alert — rapid triple burst */
  peak: () => vibrate([90, 50, 90, 50, 140]),
  /** rest complete */
  done: () => vibrate([120, 60, 200]),
  /** rewind spin */
  rewind: () => vibrate([30, 30, 30, 30, 60]),
};
