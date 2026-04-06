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
        },
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
      },
    },
  },
  plugins: [],
};
