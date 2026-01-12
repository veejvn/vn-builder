import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        "background-light": "var(--background-light)",
        "background-dark": "var(--background-dark)",
        "card-dark": "var(--card-dark)",
        "border-dark": "var(--border-dark)",
        "surface-dark": "var(--surface-dark)",
        "surface-darker": "var(--surface-darker)",
        "text-secondary": "var(--text-secondary)",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
