/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 35px 90px rgba(15, 23, 42, 0.25)',
      },
      borderRadius: {
        xl: '1rem',
        '2.5xl': '1.75rem',
      },
    },
  },
  plugins: [],
}

