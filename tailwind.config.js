/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: {
          DEFAULT: '#050505',
          pure: '#000000',
          card: '#121214',
          deep: '#171717',
          border: '#262629',
        },
        brand: {
          red: '#ED101C',
          redHover: '#C80B15',
          redDark: '#8F0810',
          gray: '#B8B8B8',
          light: '#F4F4F6',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'red-glow': '0 10px 35px -5px rgba(237, 16, 28, 0.45)',
        'red-glow-sm': '0 4px 18px -2px rgba(237, 16, 28, 0.35)',
        'card-light': '0 14px 34px -8px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
