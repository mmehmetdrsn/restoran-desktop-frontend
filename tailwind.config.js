/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0a1a2b',
        gold: '#c9a86c',
        background: '#f0f4f9',
        textLight: '#667e96',
        success: '#2ecc71',
        error: '#e74c3c',
        warning: '#f39c12',
        border: '#dce3ec',
      }
    },
  },
  plugins: [],
}