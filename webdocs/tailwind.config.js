module.exports = { 
  mode : "jit",
  purge: ["./styles/global.css","./pages/**","./components/**"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily : {
        rubik : ["Rubik","sans-serif"]
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
