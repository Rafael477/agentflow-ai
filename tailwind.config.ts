import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        card: "rgb(var(--color-card) / <alpha-value>)",
        panel: "rgb(var(--color-panel) / <alpha-value>)",
        primary: "#14B8A6",
        accent: "#A855F7",
        muted: "#9CA3AF"
      },
      boxShadow: {
        glow: "0 18px 60px rgba(20, 184, 166, 0.14)"
      }
    }
  },
  plugins: [animate]
};

export default config;
