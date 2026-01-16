/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'ca-blue': {
          DEFAULT: '#1e3a5f',
          dark: '#0f1f35',
          light: '#2d4a6f',
        },
        'ca-purple': {
          DEFAULT: '#7c3aed',
          light: '#8b5cf6',
          dark: '#6d28d9',
        },
        'ca-accent': {
          DEFAULT: '#3b82f6',
          light: '#60a5fa',
        },
      },
    },
  },
  plugins: [],
};
