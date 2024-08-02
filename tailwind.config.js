/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width:{
        'custom-nav': 'calc(91.6667% + 60px)',
      },
      colors:{
        'backColor': '#eeeeee',
        'navBar': '#212121',
        'productsMenu': '#FD8A8A',
        'createMenu':'#BAD7E9',
        'billMenu': '#F1F7B5',
        'costMenu': '#B9F8D3'
      }
    },
  },
  plugins: [],
}

