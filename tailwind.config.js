/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Couleurs du design - Virida
        primary: '#2AD368',
        'accent-glow': '#2AD368',
        highlight: '#CBED62',
        'background-light': '#f8fafc',
        'background-dark': '#121A21',
        glass: 'rgba(255, 255, 255, 0.03)',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
        // Anciennes couleurs pour compatibilité
        'virida-green': {
          bright: '#2AD368',
          light: '#CBED62',
          dark: '#052E1C',
        },
        'virida-gray': {
          dark: '#121A21',
        },
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        full: '9999px',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
