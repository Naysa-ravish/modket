/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: '#f5368c',
          dark: '#0d0b1f',
          light: '#ffe6f0',
        },
      },
    },
  },
  plugins: [],
};

