/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: '#f1f5f9',
        bg: '#0a0a0f',
        surface: '#13131a',
        surface2: '#1a1a26',
        gold: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
      boxShadow: {
        neon: '0 0 24px rgba(245, 158, 11, 0.22), 0 16px 40px rgba(0, 0, 0, 0.45)',
      },
      backgroundImage: {
        'hero-radial':
          'radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.18), transparent 48%), radial-gradient(circle at 85% 100%, rgba(217, 119, 6, 0.12), transparent 40%)',
      },
    },
  },
  plugins: [],
}
