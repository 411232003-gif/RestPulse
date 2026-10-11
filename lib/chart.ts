/**
 * Chart helpers ported from the Analytic-Dashboard design:
 * Catmull-Rom → cubic Bézier smoothing so the line passes exactly
 * through every point with natural curvature.
 */

export function buildSmoothPath(points: [number, number][]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0][0]} ${points[0][1]} `;
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const p0 = points[i - 1] || [2 * p1[0] - p2[0], 2 * p1[1] - p2[1]];
    const p3 = points[i + 2] || [2 * p2[0] - p1[0], 2 * p2[1] - p1[1]];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]} `;
  }
  return d.trim();
}

/** Invert a cubic-bezier Y progress → X (time fraction). Matches CSS easing. */
export function easedTimeForProgress(target: number, x1 = 0.2, y1 = 0.2, x2 = 0.8, y2 = 1): number {
  const comp = (t: number, c1: number, c2: number) => {
    const mt = 1 - t;
    return 3 * mt * mt * t * c1 + 3 * mt * t * t * c2 + t * t * t;
  };
  let lo = 0,
    hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (comp(mid, y1, y2) < target) lo = mid;
    else hi = mid;
  }
  return comp((lo + hi) / 2, x1, x2);
}
