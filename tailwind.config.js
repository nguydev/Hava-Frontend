/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/features/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Backgrounds & surfaces (GOODR deep-space theme)
        bg: '#080B12',
        surface: '#0D1420',
        card: '#131C2B',
        'card-2': '#1B2740',
        hair: '#25344B',
        overlay: 'rgba(4,8,16,0.74)',

        // Brand accent scale — electric blue → cyan (names kept for compatibility)
        heat: {
          DEFAULT: '#2E90FA',
          dark: '#1E6FE0',
          light: '#38D6F0',
          soft: 'rgba(46,144,250,0.14)',
        },
        brand: {
          blue: '#2E90FA',
          cyan: '#22D3EE',
          indigo: '#3B6FF5',
        },
        amber: '#F5A524',

        // Semantic status
        ok: '#22C55E',
        alert: '#F04452',
        info: '#38BDF8',
        warn: '#F5A524',
        steel: '#60A5FA',

        // Text scale
        'ink-0': '#F5F9FF',
        'ink-1': '#DCE6F7',
        'ink-2': '#93A4C1',
        'ink-3': '#5D6E8C',

        // Light surfaces (for high-contrast field cards)
        light: '#F8FAFC',
      },
      borderRadius: {
        card: '20px',
        pill: '999px',
      },
    },
  },
  plugins: [],
};
