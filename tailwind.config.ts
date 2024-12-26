import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'indigo-600': '#4f46e5',
        green: {
          400: '#32CD32',
        },
        blue: {
          500: '#1E90FF',
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 1s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        '2xl': '0 10px 30px rgba(0, 0, 0, 0.1)',
      },
      transitionProperty: {
        'transform': 'transform',
        'box-shadow': 'box-shadow',
      },
      
    },
  },
  plugins: [],
} satisfies Config;
