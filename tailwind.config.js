/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#050505", // near pure black
        surface: "#111111", // very dark grey
        "surface-light": "#1f1f1f", // slightly lighter
        shadow: "#000000", // pure black
        text: "#fafafa", // white/off-white
        "text-muted": "#a3a3a3", // muted grey
        accent: "#ddb640", // cuttr gold
        accent2: "#facc15", // bright yellow/gold for gradient
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Outfit", "sans-serif"],
      },
      boxShadow: {
        inset: "inset 0 0 10px rgba(221, 182, 64, 0.5)",
        glass: "0 4px 30px rgba(0, 0, 0, 0.5)",
        neon: "0 0 20px rgba(221, 182, 64, 0.5)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(to right bottom, #111111, #050505)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
};
