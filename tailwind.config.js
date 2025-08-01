/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['\"Plus Jakarta Sans\"', 'system-ui', 'sans-serif'],
        mono: ['\"Roboto Mono\"', 'monospace'],
      },
    },
  },
  plugins: [],
};
