/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      colors: {
        primary: "#38d1da",
        "on-primary": "#00373a",
        "primary-container": "#b7eff3",
        surface: "#f8fafb",
        "surface-low": "#f2f4f5",
        "surface-container": "#ecedee",
        "on-surface": "#191c1d",
        "on-surface-variant": "#3f4849",
        outline: "#6f797a",
        "outline-variant": "#bfc8ca",
      },
    },
  },
  plugins: [],
};
