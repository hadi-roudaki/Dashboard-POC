/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "king-primary": "#003366",
        "king-secondary": "#E37222",
      },
    },
  },
  plugins: [],
};
