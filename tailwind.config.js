/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: [
    "./App.{js,jsx,ts,tsx}", 
		"./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        // 'pacifico' becomes the tailwind class name
        pacifico: ['Pacifico-Regular'],
      }
    },
  },
  plugins: [],
}

