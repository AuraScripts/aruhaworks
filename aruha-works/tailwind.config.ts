import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#050505",
        card: "#0c0c0c",
        cardHover: "#121212",
        border: "#1a1a1a",
        borderBright: "#2a2a2a",
        text: "#f5f5f5",
        muted: "#888888",
        accent: "#ffffff",
        accentDim: "#cccccc",
        sale: "#ef4444",
        success: "#22c55e",
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.03em",
        widest2: "0.16em",
      },
      boxShadow: {
        card: "0 4px 24px -4px rgba(0,0,0,0.5)",
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "float-slow": "float-slow 18s ease-in-out infinite",
        "float-slower": "float-slower 24s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2.5s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0) rotate(-6deg)" },
          "50%": { transform: "translateY(-24px) rotate(4deg)" },
        },
        "float-slower": {
          "0%, 100%": { transform: "translateY(0) rotate(8deg)" },
          "50%": { transform: "translateY(20px) rotate(-4deg)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.65" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
