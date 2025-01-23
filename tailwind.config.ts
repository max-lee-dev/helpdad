import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
    fontFamily: {
      roboto: ['var(--font-roboto)'],
      opensans: ['var(--font-opensans)'],
      lato: ['var(--font-lato)'],
      sans: [
        'var(--font-roboto)',
        'Roboto',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Arial',
        'sans-serif',
      ],
    }
  },
  plugins: [],
};
export default config;
