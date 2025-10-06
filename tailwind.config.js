/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primaryOrange: '#F97316',
        deepPurple: '#6366F1',
        glassWhite: 'rgba(255,255,255,0.1)'
      },
      backdropBlur: {
        glass: '16px',
      },
    },
  },
};
