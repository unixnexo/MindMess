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
      },
      screens: {
        "xs": "400px",
      }
    },
  },
  plugins: [],
}

