"use client";

import type { ReactNode, ButtonHTMLAttributes } from "react";
import { haptics } from "@/lib/haptics";

/**
 * Isometric 3D block button — adapted from `button kotak 3d`.
 * rotate(-30°) skew(25°) with ::before (left face) and ::after (bottom face)
 * giving real depth; lifts on hover/press with a deeper cast shadow.
 *
 * Variants are re-tinted to the RestPulse palette.
 */

type Variant = "volt" | "cyan" | "red" | "slate";

const VARIANTS: Record<Variant, { face: string; side: string; bottom: string; text: string }> = {
  volt: { face: "#D4FF00", side: "#8aa800", bottom: "#b8d600", text: "#0B0E14" },
  cyan: { face: "#00E5FF", side: "#0093a8", bottom: "#00c2da", text: "#052229" },
  red: { face: "#FF2E55", side: "#a81533", bottom: "#d62449", text: "#ffffff" },
  slate: { face: "#2A3242", side: "#161b25", bottom: "#1f2633", text: "#ffffff" },
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ReactNode;
  label: string;
  sublabel?: string;
}

export default function Iso3DButton({
  variant = "volt",
  icon,
  label,
  sublabel,
  className = "",
  onClick,
  ...rest
}: Props) {
  const v = VARIANTS[variant];
  return (
    <button
      {...rest}
      onClick={(e) => {
        haptics.tap();
        onClick?.(e);
      }}
      className={`group relative select-none outline-none ${className}`}
      style={{ transform: "rotate(-30deg) skew(25deg)", transition: "transform .45s cubic-bezier(.2,.8,.2,1), filter .45s" }}
    >
      <span
        className="relative flex items-center gap-4 pl-5 pr-7 h-[76px] min-w-[210px] font-display uppercase transition-all duration-300
          group-hover:-translate-y-2 group-hover:translate-x-2 group-active:translate-y-1 group-active:translate-x-0"
        style={{
          background: v.face,
          color: v.text,
          boxShadow: "-20px 20px 14px rgba(0,0,0,0.55)",
          letterSpacing: "0.14em",
        }}
      >
        {/* left depth face */}
        <span
          aria-hidden
          className="absolute top-[10px] -left-5 w-5 h-full"
          style={{ background: v.side, transform: "skewY(-45deg)" }}
        />
        {/* bottom depth face */}
        <span
          aria-hidden
          className="absolute -bottom-5 -left-[11px] w-full h-5"
          style={{ background: v.bottom, transform: "skewX(-45deg)" }}
        />
        {icon && <span className="shrink-0 [&>svg]:w-8 [&>svg]:h-8">{icon}</span>}
        <span className="flex flex-col items-start leading-tight">
          <span className="text-lg font-black tracking-widest">{label}</span>
          {sublabel && (
            <span className="text-[10px] font-semibold opacity-70 tracking-[0.3em] normal-case">
              {sublabel}
            </span>
          )}
        </span>
      </span>
    </button>
  );
}
