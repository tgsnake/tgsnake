const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  mode : "jit",
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
    ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: { 
      typography(theme) {
        return {
          DEFAULT:{
            css : {
              a : {
                textDecoration : "none"
              },
              "code::after" : {
                content : ""
              },
              "code::before" : {
                content : ""
              },
              'h4,h5,h6': {
              color: theme('colors.gray.900'),
              },
              code: {
                color: theme('colors.pink.500'),
                paddingLeft: '4px',
                paddingRight: '4px',
                paddingTop: '2px',
                paddingBottom: '2px'
              }
            }
          },
          dark: {
            css: {
              color: theme("colors.gray.300"),
              '[class~="lead"]': { color: theme("colors.gray.400") },
              strong: { color: theme("colors.gray.100") },
              a : { color: theme("colors.blue.300") },
              "ul > li::before": { backgroundColor: theme("colors.gray.700") },
              hr: { borderColor: theme("colors.gray.800") },
              blockquote: {
                color: theme("colors.gray.100"),
                borderLeftColor: theme("colors.gray.800"),
              },
              h1: { color: theme("colors.gray.100") },
              h2: { color: theme("colors.gray.100") },
              h3: { color: theme("colors.gray.100") },
              h4: { color: theme("colors.gray.100") },
              h5: { color: theme("colors.gray.100") },
              h6: { color: theme("colors.gray.100") },
              "a code": { color: theme("colors.gray.100") },
              pre: {
                color: theme("colors.gray.200"),
                backgroundColor: theme("colors.gray.800"),
              },
              thead: {
                color: theme("colors.gray.100"),
                borderBottomColor: theme("colors.gray.700"),
              },
              "tbody tr": { borderBottomColor: theme("colors.gray.800") },
            },
          },
        };
      },
      fontFamily : {
        poppins : ["Poppins","sans-serif"]
      },
      colors: {
        primary: colors.teal,
        gray: colors.trueGray,
        code: {
          green: '#b5f4a5',
          yellow: '#ffe484',
          purple: '#d9a9ff',
          red: '#ff8383',
          blue: '#93ddfd',
          white: '#fff',
        },
      }
    }, 
  },
  variants: {
    extend: {
      typography: ['dark']
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
