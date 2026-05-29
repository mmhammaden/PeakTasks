/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      colors: {
        brand: {
          DEFAULT: '#003399',
          light:   '#4477ff',
          lighter: '#6699ff',
        },
      },
    },
  },
  // safelist the arbitrary brand colors so they survive production purging
  safelist: [
    'bg-[#003399]',
    'hover:bg-[#003399]',
    'bg-[#0044cc]',
    'hover:bg-[#0044cc]',
    'text-[#003399]',
    'text-[#4477ff]',
    'text-[#6699ff]',
    'hover:text-[#4477ff]',
    'hover:text-[#6699ff]',
    'border-[#003399]',
    'border-[#003399]/50',
    'bg-[#003399]/10',
    'ring-[#003399]',
    'focus:ring-[#003399]',
    'shadow-blue-900/30',
    'shadow-blue-950/40',
    'shadow-blue-950/50',
    'hover:shadow-lg',
  ],
  plugins: [],
};
