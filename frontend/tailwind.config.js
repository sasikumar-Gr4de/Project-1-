/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx}"],
  prefix: "",
  theme: {
    extend: {
      colors: {
        primary: "#ff49db",
        secondary: "#007bff",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
