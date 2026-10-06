/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Tailwind 3.3 lacks these steps; classes like text-white/85 are used across the site.
      opacity: { 15: '0.15', 35: '0.35', 45: '0.45', 55: '0.55', 65: '0.65', 85: '0.85' },
      // Public-site design system (editorial: paper, ink, gold). The dashboard keeps its own styling.
      colors: {
        paper: '#f7f5f0',
        'paper-tint': '#eee9de',
        'paper-card': '#fbfaf7',
        'paper-featured': '#f2eee4',
        ink: '#143642',
        'ink-deep': '#0f2930',
        'ink-footer': '#091f27',
        'ink-soft': '#214f5b',
        muted: '#506368',
        gold: '#a77c38',
        'gold-dark': '#725322',
        'gold-text': '#6a582f',
        'gold-light': '#ddc58f',
        'gold-pale': '#efe6d2',
        line: '#e7e2d9',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        body: ['"DM Sans"', 'Arial', 'sans-serif'],
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
      },
      maxWidth: { site: '1240px' },
    },
  },
  plugins: [],
};
