/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0a1a2b',
        gold: '#c9a86c',
        background: '#f0f4f9',
        textLight: '#667e96',
        success: '#2ecc71',
        error: '#e74c3c',
        warning: '#f39c12',
        border: '#dce3ec',
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'custom': '0 4px 20px rgba(0,0,0,0.08)',
        'custom-hover': '0 8px 30px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
      },
      // ⬇️ ANİMASYONLAR BURAYA EKLENECEK ⬇️
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        animation: {
  'fade-in': 'fadeIn 0.3s ease-in-out',
  'slide-in': 'slideIn 0.3s ease-out',
},
               keyframes: {
                fadeIn: {
               '0%': { opacity: '0' },
                '100%': { opacity: '1' },
               },
               slideIn: {
               '0%': { transform: 'translateX(-100%)' },
             '100%': { transform: 'translateX(0)' },
        },
       }
      }
    },
  },
  plugins: [],
}