/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-dark': 'var(--primary-dark)',
        danger: 'var(--danger)',
        warning: 'var(--warning)',
        success: 'var(--success)',
        info: 'var(--info)',
        'dark': 'var(--dark)',
        'light': 'var(--light)',
        'gray-text': 'var(--gray)',
        'dark-gray': 'var(--dark-gray)',
        'card-bg': 'var(--card-bg)',
        'sidebar-bg': 'var(--sidebar-bg)',
        'header-bg': 'var(--header-bg)',
        border: 'var(--border)',
      },
    },
  },
  plugins: [],
}