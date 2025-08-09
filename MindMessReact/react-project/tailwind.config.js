/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "main-blue": "#007AFF",
        "hover": "#0000000d",
        "secondary-white": "#f0f0f0",
        "border": "#C7C7C7",
        "red": "#F06B7A",
      },
      screens: {
        "xs": "400px",
      }
    },
  },
  plugins: [],
}

