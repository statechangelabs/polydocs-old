/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["IBM Plex Sans Devanagari", "sans-serif"],
      },
      colors: {
        purple: {
          light: "#C971FF",
          default: "#A050D2",
          dark: "#7C2AAD",
        },
        teal: {
          light: "#66FFC8",
          dark: "#509E8C",
        },
        black: "#202020",
      },
    },
  },
  variants: {},
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    // require("@tailwindcss/aspect-ratio"),
  ],
};
