/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0a0f29",
          "navy-mid": "#1a1f3a",
          "navy-light": "#23284a",
          surface: "#2d3257",
        },
        accent: {
          DEFAULT: "#FFD600",
          hover: "#e6c200",
          muted: "rgba(255, 214, 0, 0.15)",
          cyan: "#00E0FF",
          "cyan-soft": "rgba(0, 224, 255, 0.18)",
          violet: "#8A6DFF",
          "violet-soft": "rgba(138, 109, 255, 0.18)",
        },
        surface: {
          glass: "rgba(255, 255, 255, 0.04)",
          "glass-strong": "rgba(255, 255, 255, 0.06)",
        },
        hairline: {
          DEFAULT: "rgba(255, 255, 255, 0.08)",
          strong: "rgba(255, 255, 255, 0.12)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(2.5rem, 7vw, 5.25rem)", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-lg": ["clamp(2rem, 4.5vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.025em", fontWeight: "700" }],
        eyebrow: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.18em", fontWeight: "500" }],
      },
      spacing: {
        section: "5rem",
        "section-sm": "3.5rem",
      },
      maxWidth: {
        readable: "42rem",
      },
      boxShadow: {
        "brand-glow": "0 0 24px rgba(255, 214, 0, 0.25)",
        "cyan-glow": "0 0 28px rgba(0, 224, 255, 0.18)",
        "glass-lift": "0 12px 40px rgba(0, 0, 0, 0.35)",
      },
      backdropBlur: {
        glass: "12px",
      },
      animation: {
        "aurora-drift": "aurora-drift 60s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
      },
      keyframes: {
        "aurora-drift": {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(8%, -6%) scale(1.05)" },
          "66%": { transform: "translate(-6%, 8%) scale(0.95)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 0 0 rgba(0, 224, 255, 0.7)" },
          "50%": { opacity: "0.6", boxShadow: "0 0 0 6px rgba(0, 224, 255, 0)" },
        },
      },
    },
  },
  plugins: [],
};
