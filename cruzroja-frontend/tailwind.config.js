/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // escanea todos tus componentes
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // si usas app router
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar")],
};
