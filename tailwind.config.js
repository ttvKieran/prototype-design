/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#effaff',
          100: '#d9f4ff',
          200: '#b9ebff',
          300: '#83ddff',
          400: '#44c8ff',
          500: '#15adef',
          600: '#068cc9',
          700: '#0a6fa1',
          800: '#105e84',
          900: '#144f6d',
        },
        ink: '#081420',
        surface: '#f4f9fc',
        storm: '#0f2942',
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 50px -24px rgba(15, 41, 66, 0.35)',
      },
      backgroundImage: {
        'rain-grid':
          'radial-gradient(circle at top, rgba(21, 173, 239, 0.12), transparent 32%), linear-gradient(120deg, rgba(8, 20, 32, 0.98), rgba(16, 94, 132, 0.96))',
      },
    },
  },
  plugins: [],
}
