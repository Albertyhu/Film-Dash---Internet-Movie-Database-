/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./views/**/*.{html, js, ejs}",
    ],
  theme: {
      extend: {
          colors: {
              'Panel-BG': 'rgba(199, 255, 218, 1)',
              'CancelButton-Color': '#E8E1EF',
              'NewMsgButtonColor': "#C4F4C7",
          }
      },
  },
    plugins: [
        {
            tailwindcss: {},
            autoprefixer: {},
        },
    ],
}
