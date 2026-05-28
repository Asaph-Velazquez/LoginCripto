/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [
    require('tailwindcss-preset-email'),
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#07111f',
          surface: '#0d1c2e',
          border: '#25415f',
          primary: '#62a8ff',
          primaryStrong: '#0759c9',
          accent: '#37d5ff',
          text: '#eef7ff',
          muted: '#9fb7d0',
          success: '#8ff7c0',
        },
      },
      fontFamily: {
        sans: ['Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        brand: '0 24px 80px rgba(0, 0, 0, 0.38)',
      },
    },
  },
  content: [
    './components/**/*.html',
    './emails/**/*.html',
    './layouts/**/*.html',
  ],
}
