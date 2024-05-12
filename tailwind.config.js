/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(265, 11%, 22%)",
        shadow: "hsl(256, 5%, 44%)",
        text: "hsl(270, 3%, 75%)",
        accent: "hsl(45, 70%, 56%)",
        accent2: "hsl(37, 72%, 54%)",
      },
      boxShadow: {
        inset: "inset 0 0 10px hsl(45, 70%, 56%)",
      },
    },
  },
  plugins: [],
};
