/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html, js, ejs}"],
  theme: {
    extend: {
      colors: {
        "Panel-BG": "rgba(199, 255, 218, 1)",
        "CancelButton-Color": "#E8E1EF",
        NewMsgButtonColor: "#C4F4C7",
          },
      screens: {
        'xm': { 'min': '360px' },
        'sm': { 'min': '640px' },
        'md': { 'min': '768px' },
        'lg': { 'min': '1024px' },
        'xl': { 'min': '1280px' },
        '2xl': { 'min': '1536px' }
      }
    },
  },
  plugins: [
    {
      tailwindcss: {},
      autoprefixer: {},
    },
  ],
};
