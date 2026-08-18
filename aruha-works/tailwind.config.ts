import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 0Resmon-inspired modern dark palette
        bg: "#0b0c0f",          // page background
        card: "#12141a",        // cards / raised surfaces
        cardHover: "#171a22",
        border: "#1e222c",      // subtle borders
        borderBright: "#2a3040",
        text: "#f0f2f5",        // primary text
        muted: "#8b92a5",       // secondary text
        accent: "#3b82f6",      // primary accent (blue)
        accentHover: "#2563eb",
        success: "#22c55e",
        sale: "#ef4444",        // discount / sale red
        tag: "#1e293b",         // framework tag bg
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.03em",
        widest2: "0.18em",
      },
      boxShadow: {
        card: "0 4px 24px -4px rgba(0,0,0,0.4)",
        glow: "0 0 40px -10px rgba(59,130,246,0.35)",
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
