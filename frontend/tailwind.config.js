module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Poppins"', 'sans-serif'], // Replace "Inter" with your font
      },
      colors: {
        primary: '#E5F3FA',      // custom blue
        secondary: '#D3D3FF',    // custom pink
      },
    },
  },
  plugins: [],
};
