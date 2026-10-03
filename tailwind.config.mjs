/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // 🟢 Core Aviorè Go Emerald Accents (From Prototype)
        brand: {
          DEFAULT: "#00875A", // Trademark Emerald Green
          dark: "#004D34",    // Deep Emerald Balance Card Tone
          light: "#00B37E",   // Bright Interaction Glow
          soft: "#F0FAF6",    // Ultra-light green background fill
        },
        primary: {
          DEFAULT: "#111111", // Premium Black
          light: "#1A1A1A",
          soft: "#2A2A2A",
        },
        accent: {
          DEFAULT: "#F97316",
          light: "#FDBA74",
        },
        success: "#16A34A",
        warning: "#F59E0B",
        danger: "#DC2626",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        "2xl": "1.5rem",
        "3xl": "2rem",
        "4xl": "3rem",
      },
      keyframes: {
        "shrink-width": {
          "0%": { width: "100%" },
          "100%": { width: "0%" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "progress": "shrink-width 4s linear forwards",
        "fadeIn": "fadeIn 0.4s ease-out",
        "slideUp": "slideUp 0.5s ease-out",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};