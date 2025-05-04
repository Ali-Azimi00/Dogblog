/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#1b634b',
        secondary: '#000000',
        tert: '#ffffff',
        exPrime: '#161622',
        exSec: {
          DEFAULT: "#FF9C01",
          100: "#FF9001",
          200: "#FF8E01",
        },

      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],

      }
    },
  },
  plugins: [],
  safelist: [
    { pattern: /(bg|text|border)-ex(Prime|Sec)/ },
    { pattern: /(bg|text|border)-(red|black|white|gray|exSec)-(100|200|300|400|500|600|700|800|900)/ },
    { pattern: /rounded-(lg|xl|2xl|3xl)/ },
    { pattern: /(p|px|py|pt|pr|pl)-(1|2|3|4|5|6|7|8|10|12|14|18|20)/ },
    { pattern: /m(b|t|x|y|l|r)-(1|2|3|4|5|6|7|8|10|12|14|18|20)/ },
    { pattern: /flex-(0|1)/ },
    { pattern: /flex/ },
    { pattern: /(w|h)-(full|4|5|6|7|8|10|12|14|16|18|20|30|34|36|38|40|48|50|56|64|72|96)/ },
    { pattern: /gap-(1|2|3|4|5)/ },
    { pattern: /shadow-(lg|black)/ },
    { pattern: /overflow-hidden/ },
    { pattern: /space-x-2/ },
    { pattern: /font-p(thin|semibold|regular)/ },


  ],
}