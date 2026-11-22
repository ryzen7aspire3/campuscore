/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: "#04060B",
          900: "#06080E",
          850: "#080B13",
          800: "#0B0F19",
          700: "#111725",
        },
        neon: {
          indigo: "#6366F1",
          cyan: "#22D3EE",
          emerald: "#34D399",
          amber: "#FBBF24",
          rose: "#FB7185",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        glass: "0 24px 70px -30px rgba(0, 0, 0, 0.9)",
        "glow-indigo": "0 0 40px -12px rgba(99, 102, 241, 0.55)",
        "glow-cyan": "0 0 40px -12px rgba(34, 211, 238, 0.45)",
        "glow-emerald": "0 0 40px -12px rgba(52, 211, 153, 0.45)",
        "glow-amber": "0 0 40px -12px rgba(251, 191, 36, 0.45)",
        "glow-rose": "0 0 40px -12px rgba(251, 113, 133, 0.45)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateX(26px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(52, 211, 153, 0.45)" },
          "70%": { boxShadow: "0 0 0 10px rgba(52, 211, 153, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(52, 211, 153, 0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-7px)" },
        },
        "bar-grow": {
          "0%": { width: "0%" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        "toast-shrink": {
          "0%": { transform: "scaleX(1)" },
          "100%": { transform: "scaleX(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.35s ease-out both",
        "fade-up": "fade-up 0.45s cubic-bezier(0.16, 1, 0.3, 1) both",
        "scale-in": "scale-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) both",
        "slide-in": "slide-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        shimmer: "shimmer 2.4s linear infinite",
        "pulse-ring": "pulse-ring 2.4s ease-out infinite",
        float: "float 7s ease-in-out infinite",
        "bar-grow": "bar-grow 0.9s cubic-bezier(0.16, 1, 0.3, 1) both",
        "spin-slow": "spin-slow 9s linear infinite",
        "toast-shrink": "toast-shrink 4.2s linear forwards",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "64px 64px",
      },
    },
  },
  plugins: [],
};
