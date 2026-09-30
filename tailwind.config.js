/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pitch: {
          dark: '#0e3a1f',
          light: '#134e2a',
          line: 'rgba(255, 255, 255, 0.75)',
          spotlight: '#ffea00',
        },
        mnf: {
          navy: '#0b111e',
          card: '#151d2f',
          accent: '#00f0ff',
          red: '#ff3366',
          yellow: '#facc15',
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 240, 255, 0.4)',
        'glow-red': '0 0 20px rgba(255, 51, 102, 0.4)',
        'spotlight': '0 0 40px 15px rgba(255, 234, 0, 0.45)',
      }
    },
  },
  plugins: [],
}
