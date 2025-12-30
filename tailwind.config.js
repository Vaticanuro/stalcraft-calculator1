/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Можно добавить цвета рангов Stalcraft
        'rank-veteran': '#your-color-here',
      }
    },
  },
  plugins: [],
}