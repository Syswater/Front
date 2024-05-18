/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        gray: '#B1B1B1',
        cyan: '#72DCDC',
        blue_dark: '#404452',
        white_dark: '#E2E2E2',
        blue_1: '#6EB8DB',
        blue_2: '#6DDBDA',
        blue_3: '#6E96DB',
        green_1: '#6EDAB6',
        green_2: '#6FDB90',
        gray_dark: '#7E86A0',
        warn: '#f44336'
      },
      boxShadow: {
        'table': '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}