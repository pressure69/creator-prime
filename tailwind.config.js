/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neonPink: '#ff1493',
        cyberPurple: '#8a2be2',
        cyberBlack: '#0a0a0a',
      },
    },
  },
  plugins: [],
}
