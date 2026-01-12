import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        vgt: {
          primary: '#636B2F',
          dark: '#3D4127',
          surface: '#BAC095',
          highlight: '#D4DE95',
        },
      },
      borderRadius: {
        card: '16px',
        button: '12px',
        input: '8px',
      },
    },
  },
  plugins: [],
};

export default config;
