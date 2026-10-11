import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#0B0E14",
        slate: {
          deep: "#151921",
          panel: "#1A2029",
          edge: "#232B38",
        },
        volt: "#D4FF00",
        cyber: "#FFB800",
        infra: "#FF2E55",
        ocean: "#00E5FF",
      },
      fontFamily: {
        display: ["var(--font-display)", "Arial Black", "sans-serif"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glass": "inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 42px rgba(0,0,0,0.65)",
        "volt-glow": "0 0 24px rgba(212,255,0,0.35), 0 0 64px rgba(212,255,0,0.12)",
        "cyan-glow": "0 0 24px rgba(0,229,255,0.35), 0 0 64px rgba(0,229,255,0.12)",
        "red-glow": "0 0 24px rgba(255,46,85,0.45), 0 0 72px rgba(255,46,85,0.18)",
        "amber-glow": "0 0 24px rgba(255,184,0,0.4), 0 0 64px rgba(255,184,0,0.15)",
      },
      keyframes: {
        rise: {
          from: { opacity: "0", transform: "translateY(24px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.06)" },
        },
        tickFlash: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0.25" },
        },
      },
      animation: {
        rise: "rise 1s cubic-bezier(.2,.8,.2,1) both",
        pulseGlow: "pulseGlow 1.1s ease-in-out infinite",
        tickFlash: "tickFlash 1s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
