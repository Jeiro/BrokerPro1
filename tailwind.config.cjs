module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,vue,svelte,css}'
  ],
  theme: {
    extend: {},
  },
  safelist: [
    { pattern: /^bg-/, variants: [] },
    { pattern: /^(p|m|text)-/, variants: [] },
    'rounded',
    'text-white'
  ],
  plugins: [],
};
