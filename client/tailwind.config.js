// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      sm: '360px',
      md: '768px',
      lg: '1024px',
    },
    extend: {
      colors: {
        emerald: '#10B981',
        gold:    '#FBBF24',
        magenta: '#D946EF',
        cyan:    '#06B6D4',
        cream:   '#E6DCC7',
        'text-primary': '#FFFFFF',
        'text-secondary': '#F3F4F6',
        screen:  '#1E293B',
        surface: '#F3F4F6',
      },
      fontFamily: {
        luckiest: ["'Luckiest Guy'", 'cursive'],
        rubik:    ["'Rubik'", 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        'soft-lg': '0 4px 6px rgba(0,0,0,0.1)',
        'hard-cr': '0 4px 0 rgba(0,0,0,0.2)',
      },
      spacing: {
        2: '0.5rem',
        4: '1rem',
      },
      backgroundImage: theme => ({
        // Core Golem Runner gradient
        'golem-gradient': 'linear-gradient(90deg, #FF6B00, #FFC800)',

        // Custom gradients for each color
        'emerald-gradient':`linear-gradient(to right, ${theme('colors.emerald.dark')}, ${theme('colors.emerald.light')})`,
        'gold-gradient':`linear-gradient(to right, ${theme('colors.gold.dark')}, ${theme('colors.gold.light')})`,
        'magenta-gradient':`linear-gradient(to right, ${theme('colors.magenta.dark')}, ${theme('colors.magenta.light')})`,
        'cyan-gradient':`linear-gradient(to right, ${theme('colors.cyan.dark')}, ${theme('colors.cyan.light')})`,
      }),
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}
