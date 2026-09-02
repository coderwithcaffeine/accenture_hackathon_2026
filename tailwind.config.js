/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#A100FF',
        },
        theme: {
          bg: 'var(--color-main-bg)',
          card: 'var(--color-card-bg)',
          border: 'var(--color-border)',
          text: 'var(--color-primary-text)',
          muted: 'var(--color-secondary-text)',
          accent: 'var(--color-secondary-accent)',
        },
        status: {
          green: '#3FAE72',
          amber: '#E3A23C',
          red: '#D9564E',
          gray: '#6B7280',
          blue: '#4E8FD1',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      keyframes: {
        'slide-left': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'slide-left': 'slide-left 0.25s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
