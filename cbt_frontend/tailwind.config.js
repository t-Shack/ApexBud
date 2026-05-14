export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        navy:  { DEFAULT: '#0F172A', 50: '#F0F4FF', 100: '#E0E9FF', 500: '#3B5BDB', 800: '#1E3A5F', 900: '#0F172A' },
        amber: { DEFAULT: '#F59E0B', 400: '#FBBF24', 500: '#F59E0B', 600: '#D97706' },
        teal:  { DEFAULT: '#0D9488', 50: '#F0FDFA', 500: '#14B8A6', 600: '#0D9488', 700: '#0F766E' },
      },
    },
  },
  plugins: [],
}
