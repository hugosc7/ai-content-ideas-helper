/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0B0113',
        'accent-yellow': '#FECE00',
        'accent-pink': '#D16A97',
        'accent-orange': '#F44C0A',
        'accent-purple': '#F23DBE',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(90deg, #FECE00 0%, #F44C0A 50%, #F23DBE 100%)',
      }
    },
  },
  plugins: [],
}
