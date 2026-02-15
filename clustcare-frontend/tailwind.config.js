/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          50: '#F0F0F0',   // Lightest - backgrounds
          100: '#D8D8D8',  // Very Light - surfaces
          200: '#B0B0B8',  // Light - cards, borders
          300: '#888890',  // Medium - secondary elements
          400: '#606068',  // Medium-Dark - muted text
          500: '#404048',  // Dark - primary text
          600: '#282830',  // Very Dark - headers
          700: '#101018',  // Darkest - navigation, emphasis
        },
      },
    },
  },
  plugins: [],
}