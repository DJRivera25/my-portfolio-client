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
        // Atelier — "The Build Log" design system
        atelier: {
          ink: "#0A0A0B",
          "ink-2": "#0C0C0E",
          surface: "#121214",
          "surface-2": "#141416",
          raised: "#1C1C20",
          paper: "#F2EFE8",
          "paper-2": "#ECEAE3",
          muted: "#A39F96",
          "muted-2": "#A7A39B",
          faint: "#6E6A62",
          gold: "#E0A53D",
          "gold-deep": "#C9952E",
          green: "#7FB996",
          "green-2": "#79B791",
          // résumé paper (inverted)
          "sheet": "#FCFBF7",
          "sheet-ink": "#161510",
          "sheet-body": "#3F3B33",
          "sheet-muted": "#6B665B",
          "sheet-gold": "#9A6A14",
          "sheet-stack-1": "#ECE6D8",
          "sheet-stack-2": "#DAD3C2",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        // Atelier typefaces
        grotesk: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        serifd: ["var(--font-instrument-serif)", "Georgia", "serif"],
        codet: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
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
        "atelier-card": "0 40px 100px -40px rgba(0, 0, 0, 0.8)",
        "atelier-sheet": "0 50px 110px -40px rgba(0, 0, 0, 0.8)",
      },
      backdropBlur: {
        glass: "12px",
      },
      animation: {
        "aurora-drift": "aurora-drift 60s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
        marquee: "marquee 38s linear infinite",
        blink: "blink 1s step-end infinite",
        "float-up": "floatUp 0.9s cubic-bezier(0.2,0.7,0.3,1) both",
        travel: "travel 1.5s linear infinite",
        "travel-v": "travelV 1.4s linear infinite",
        "fade-in": "fadeIn 0.35s ease both",
        "drawer-in": "drawerIn 0.55s cubic-bezier(0.2,0.7,0.3,1) both",
        "pulse-ring": "pulseRing 1.8s infinite",
        "spin-slow": "spinSlow 3s linear infinite",
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
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        blink: { "0%,49%": { opacity: "1" }, "50%,100%": { opacity: "0" } },
        floatUp: { from: { opacity: "0", transform: "translateY(34px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        travel: { from: { transform: "translateX(-130%)" }, to: { transform: "translateX(320%)" } },
        travelV: { from: { transform: "translateY(-130%)" }, to: { transform: "translateY(320%)" } },
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        drawerIn: { from: { transform: "translateX(50px)", opacity: "0" }, to: { transform: "translateX(0)", opacity: "1" } },
        pulseRing: {
          "0%": { boxShadow: "0 0 0 0 rgba(224,165,61,0.45)" },
          "70%": { boxShadow: "0 0 0 10px rgba(224,165,61,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(224,165,61,0)" },
        },
        spinSlow: { from: { transform: "rotate(0)" }, to: { transform: "rotate(360deg)" } },
      },
    },
  },
  plugins: [],
};
