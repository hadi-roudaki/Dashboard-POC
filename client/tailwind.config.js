/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "king-primary": "#003366",
        "king-secondary": "#E37222",
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      letterSpacing: {
        'tighter': '-0.025em',
      },
      animation: {
        'pulse-subtle': 'pulse 2s infinite',
      },
    },
  },
  plugins: [],
};
