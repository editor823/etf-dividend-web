import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#fbfbfb",
          card: "#ffffff",
          primary: "#2a201c", // Deep Brown / Charcoal
          secondary: "#f5ebe0", // Warm Beige / Tan
          secondaryHover: "#ecdccb",
          dark: "#1c1512",
          muted: "#78716c",
        },
        income: {
          DEFAULT: "#2d6a4f", // Muted Forest Green
          dark: "#1b4332",
          light: "#e8f5ed",
        },
        alert: {
          DEFAULT: "#c94a29", // Muted Coral
          dark: "#a83719",
          light: "#fdf2ef",
        },
        subtle: {
          border: "#e5e7eb",
          bg: "#f8f9fa",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        elevated: "0 4px 6px -1px rgba(42, 32, 28, 0.07), 0 2px 4px -1px rgba(42, 32, 28, 0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
