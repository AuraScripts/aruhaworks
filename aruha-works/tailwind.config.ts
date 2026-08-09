import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0a",       // background
        raised: "#131313",    // panel background
        paper: "#f2f2ee",     // primary text / inverse surfaces
        dim: "#8f8f89",       // secondary text
        line: "#2a2a2a",      // hairline borders
        linebright: "#f2f2ee",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        widest2: "0.28em",
      },
      backgroundImage: {
        blueprint:
          "linear-gradient(to right, rgba(242,242,238,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(242,242,238,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
    },
  },
  plugins: [],
};
export default config;
