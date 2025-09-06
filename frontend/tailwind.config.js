/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")], // <--- Add this line
  daisyui: {
    themes: ["cupcake", "synthwave", "valentine", "aqua", "retro", "cyberpunk"], // optional, choose any
  },
};
