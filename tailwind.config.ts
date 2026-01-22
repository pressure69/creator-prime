import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cyberBlack: '#0a0a0a',
        cyberPurple: '#8b00ff',
        neonPink: '#ff00ff',
      },
    },
  },
  plugins: [],
} satisfies Config;
