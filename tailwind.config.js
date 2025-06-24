/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A', // أزرق داكن (مستوحى من العقارات الفاخرة)
        secondary: '#F59E0B', // ذهبي لإبراز العناصر
        accent: '#F3F4F6', // رمادي فاتح للخلفيات
      },
      fontFamily: {
        sans: ['"Tajawal"', 'sans-serif'], // خط عربي/إنجليزي عصري
      },
    },
  },
  plugins: [],
};