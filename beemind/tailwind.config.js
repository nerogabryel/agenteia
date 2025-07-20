/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        honey: '#fbbf24',
        amber: '#f59e0b',
        neutralBg: '#1a1a1a',
        neutralSurface: '#0f0f0f',
        neutralText: '#e5e5e7',
      },
    },
  },
  plugins: [],
};