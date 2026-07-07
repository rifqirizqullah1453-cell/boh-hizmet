/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      colors: {
        primary: "#00696e",
        "on-primary": "#ffffff",
        "primary-container": "#38d1da",
        "on-primary-container": "#00565a",
        secondary: "#5d5e61",
        tertiary: "#505f76",
        "tertiary-container": "#afbfd9",
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        surface: "#f4fbfb",
        "surface-low": "#eef5f5",
        "surface-container": "#e9efef",
        "surface-high": "#e3e9e9",
        "surface-highest": "#dde4e4",
        "on-surface": "#161d1d",
        "on-surface-variant": "#3c494a",
        outline: "#6c7a7a",
        "outline-variant": "#bbc9ca",
      },
    },
  },
  plugins: [],
};
