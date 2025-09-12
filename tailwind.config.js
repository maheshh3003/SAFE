/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f6f7f6',
          100: '#e3e8e3',
          200: '#c7d1c7',
          300: '#a3b4a3',
          400: '#7d947d',
          500: '#647864',
          600: '#4f5f4f',
          700: '#424d42',
          800: '#373f37',
          900: '#2f352f',
        },
        beige: {
          50: '#fdfcfa',
          100: '#f9f6f0',
          200: '#f2eade',
          300: '#e8dac4',
          400: '#dcc5a0',
          500: '#d1af7c',
          600: '#c49a5e',
          700: '#a6804b',
          800: '#866640',
          900: '#6d5235',
        },
        cream: {
          50: '#fefdf9',
          100: '#fdf9f0',
          200: '#faf1de',
          300: '#f5e6c4',
          400: '#eed89f',
          500: '#e5c678',
          600: '#d9b555',
          700: '#b89240',
          800: '#937336',
          900: '#785f2f',
        }
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'poppins': ['Poppins', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'space-grotesk': ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        'nunito': ['Nunito Sans', 'Inter', 'system-ui', 'sans-serif'],
        'dm-sans': ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
        'plus-jakarta': ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.8125rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'sm': ['0.9375rem', { lineHeight: '1.6', letterSpacing: '0.01em' }],
        'base': ['1.0625rem', { lineHeight: '1.7', letterSpacing: '0.01em' }],
        'lg': ['1.1875rem', { lineHeight: '1.7', letterSpacing: '0.01em' }],
        'xl': ['1.3125rem', { lineHeight: '1.6', letterSpacing: '0.01em' }],
        '2xl': ['1.5625rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        '3xl': ['1.9375rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
        '4xl': ['2.5rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
        '5xl': ['3.125rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        '6xl': ['3.9375rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        '7xl': ['4.9375rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        }
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 20px rgba(100, 120, 100, 0.3)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
