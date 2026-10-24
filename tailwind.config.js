/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light professional palette: white canvas, navy ink, royal blue action, refined gold accent
        base: {
          white: '#FFFFFF',
          canvas: '#F7F9FC',
          subtle: '#EEF2F7',
        },
        ink: {
          DEFAULT: '#0B1B33',
          soft: '#334155',
          muted: '#64748B',
        },
        navy: {
          50: '#F0F4FA',
          100: '#DCE6F3',
          600: '#1E3A8A',
          700: '#172E6B',
          800: '#112250',
          900: '#0B1B33',
        },
        gold: {
          50: '#FDF8EC',
          100: '#F8EBC8',
          300: '#E5C46B',
          400: '#D4A73A',
          500: '#C08F1E',
          600: '#A37613',
          700: '#7E5A0E',
        },
        // Backwards-compatible aliases
        apple: {
          blue: '#1D4ED8',
          'blue-hover': '#1E40AF',
          'blue-light': '#EFF6FF',
          'blue-border': '#BFDBFE',
          dark: '#0B1B33',
          gray: '#64748B',
        },
        ton: {
          bg: '#FFFFFF',
          surface: '#FFFFFF',
          elevated: '#F7F9FC',
          border: '#E2E8F0',
          'border-light': '#CBD5E1',
          blue: '#1D4ED8',
          'blue-hover': '#1E40AF',
          slate: '#64748B',
          text: '#0B1B33',
          gold: '#C08F1E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      animation: {
        'marquee': 'marquee 36s linear infinite',
        'shimmer-slide': 'shimmer-slide 3s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.25s ease-out',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'shimmer-slide': {
          '0%': { transform: 'translateX(-150%) skewX(-20deg)' },
          '55%, 100%': { transform: 'translateX(250%) skewX(-20deg)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
