/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Основные цвета темы
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        secondary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          950: '#500724',
        },
        accent: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        // Дополнительные цвета
        brain: {
          dark: '#0f172a',
          darker: '#020617',
          light: '#f8fafc',
          gray: '#1e293b',
          'gray-light': '#334155'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-brain': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-game': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-mind': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'gradient-battle': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.5s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
        'scale-in': 'scale-in 0.4s ease-out forwards',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
        'blink': 'blink 1s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite linear',
        'bounce-slow': 'bounce 3s infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'wave': 'wave 20s linear infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: 0, transform: 'translateX(-30px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: 0, transform: 'translateX(30px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: 0, transform: 'scale(0.9)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'spin-slow': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        'blink': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'wave': {
          '0%': { transform: 'translateX(0) translateY(0)' },
          '50%': { transform: 'translateX(-25%) translateY(5%)' },
          '100%': { transform: 'translateX(-50%) translateY(0)' },
        },
      },
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
      },
      transitionDelay: {
        '2000': '2000ms',
        '3000': '3000ms',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'glow': '0 0 20px rgba(139, 92, 246, 0.5)',
        'glow-lg': '0 0 40px rgba(139, 92, 246, 0.7)',
        'glow-xl': '0 0 60px rgba(139, 92, 246, 0.9)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      fontSize: {
        'xxs': '0.625rem',
        '10xl': '10rem',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      gridTemplateColumns: {
        // Для игровых полей
        'game-3': 'repeat(3, minmax(0, 1fr))',
        'game-4': 'repeat(4, minmax(0, 1fr))',
        'game-6': 'repeat(6, minmax(0, 1fr))',
        'game-8': 'repeat(8, minmax(0, 1fr))',
        'game-9': 'repeat(9, minmax(0, 1fr))',
      },
      scale: {
        '102': '1.02',
        '105': '1.05',
      },
      clipPath: {
        'hexagon': 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    function({ addUtilities, addComponents }) {
      // Кастомные утилиты
      const newUtilities = {
        '.text-shadow': {
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow-lg': {
          textShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow-none': {
          textShadow: 'none',
        },
        '.backdrop-blur-xs': {
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.scrollbar-thin': {
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(139, 92, 246, 0.5)',
            borderRadius: '4px',
            '&:hover': {
              background: 'rgba(139, 92, 246, 0.7)',
            },
          },
        },
        '.clip-hexagon': {
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
        },
        '.animation-delay-200': {
          animationDelay: '200ms',
        },
        '.animation-delay-500': {
          animationDelay: '500ms',
        },
        '.animation-delay-1000': {
          animationDelay: '1000ms',
        },
        '.animation-delay-2000': {
          animationDelay: '2000ms',
        },
        '.gradient-mask': {
          maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
        },
        '.gradient-text': {
          background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
      }
      
      // Кастомные компоненты
      const newComponents = {
        '.btn-primary': {
          '@apply px-6 py-3 rounded-full font-bold transition-all duration-300': {},
          '@apply bg-gradient-to-r from-purple-600 to-pink-600': {},
          '@apply hover:from-purple-700 hover:to-pink-700': {},
          '@apply hover:shadow-lg hover:shadow-purple-500/30': {},
          '@apply active:scale-95': {},
          '@apply disabled:opacity-50 disabled:cursor-not-allowed': {},
        },
        '.btn-secondary': {
          '@apply px-6 py-3 rounded-full font-bold transition-all duration-300': {},
          '@apply bg-gradient-to-r from-cyan-600 to-blue-600': {},
          '@apply hover:from-cyan-700 hover:to-blue-700': {},
          '@apply hover:shadow-lg hover:shadow-cyan-500/30': {},
          '@apply active:scale-95': {},
        },
        '.btn-ghost': {
          '@apply px-6 py-3 rounded-full font-bold transition-all duration-300': {},
          '@apply bg-white/5 hover:bg-white/10': {},
          '@apply border border-white/10 hover:border-white/20': {},
          '@apply active:scale-95': {},
        },
        '.card-glass': {
          '@apply backdrop-blur-lg bg-white/5 border border-white/10': {},
          '@apply rounded-2xl shadow-xl transition-all duration-300': {},
          '@apply hover:border-white/20 hover:shadow-2xl': {},
        },
        '.card-gradient': {
          '@apply rounded-2xl shadow-xl transition-all duration-300': {},
          '@apply bg-gradient-to-br from-gray-800/50 to-gray-900/50': {},
          '@apply border border-white/10 hover:border-white/20': {},
        },
        '.input-primary': {
          '@apply w-full p-4 rounded-xl bg-white/5 border border-white/10': {},
          '@apply text-white placeholder-gray-500': {},
          '@apply focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20': {},
          '@apply transition-all duration-300': {},
        },
        '.progress-bar': {
          '@apply w-full h-2 bg-gray-800 rounded-full overflow-hidden': {},
        },
        '.progress-fill': {
          '@apply h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500': {},
        },
      }
      
      addUtilities(newUtilities)
      addComponents(newComponents)
    },
  ],
}