/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        taskify: {
          primary: {
            100: '#E7F1F1',
            500: '#3CC7C6',
            600: '#37B5B4',
            700: '#2B8D8D',
          },
        },
      },
      screens: {
        sm: '40rem',
        md: '48rem',
        lg: '64rem',
        xl: '80rem',
        '2xl': '96rem',
      },
    },
  },
  plugins: [],
}
