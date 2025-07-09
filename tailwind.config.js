/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        HelveticaNeueBlack: ["HelveticaNeueBlack"],
        HelveticaNeueBlackItalic: ["HelveticaNeueBlackItalic"],
        HelveticaNeueBold: ["HelveticaNeueBold"],
        HelveticaNeueBoldItalic: ["HelveticaNeueBoldItalic"],
        HelveticaNeueHeavy: ["HelveticaNeueHeavy"],
        HelveticaNeueHeavyItalic: ["HelveticaNeueHeavyItalic"],
        HelveticaNeueItalic: ["HelveticaNeueItalic"],
        HelveticaNeueLight: ["HelveticaNeueLight"],
        HelveticaNeueLightItalic: ["HelveticaNeueLightItalic"],
        HelveticaNeueMedium: ["HelveticaNeueMedium"],
        HelveticaNeueMediumItalic: ["HelveticaNeueMediumItalic"],
        HelveticaNeueRoman: ["HelveticaNeueRoman"],
        HelveticaNeueThin: ["HelveticaNeueThin"],
        HelveticaNeueThinItalic: ["HelveticaNeueThinItalic"],
        HelveticaNeueUltraLight: ["HelveticaNeueUltraLight"],
        HelveticaNeueUltraLightItalic: ["HelveticaNeueUltraLightItalic"],
      },
    },
  },
  plugins: [],
};