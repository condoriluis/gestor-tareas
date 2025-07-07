module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        green: {
          100: '#dcfce7',
          200: '#bbf7d0',
          800: '#166534',
        },
        blue: {
          100: '#dbeafe',
          700: '#1d4ed8',
          900: '#1e3a8a',
        }
      }
    }
  },
  plugins: [],
}