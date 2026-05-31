/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#050709',
        surface: '#0b0f14',
        surface2: '#111820',
        border: '#1a2535',
        accent: '#00d4ff',
        green: '#00ff94',
        red: '#ff4060',
        yellow: '#ffcc00',
        orange: '#ff7730',
      },
      fontFamily: {
        mono: ['IBM Plex Mono', 'monospace'],
        display: ['Unbounded', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
