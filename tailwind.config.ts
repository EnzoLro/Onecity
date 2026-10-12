import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        none: "var(--radius-none)",
      },
      colors: {
        onecity: {
          primary: "var(--color-primary)",
          background: "var(--color-background)",
          surface: "var(--color-surface)",
          "item-high": "var(--color-item-high)",
          "item-mid": "var(--color-item-mid)",
          "item-low": "var(--color-item-low)",
        },
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "var(--container-padding-mobile)",
          lg: "var(--container-padding-desktop)",
        },
        screens: {
          DEFAULT: "var(--container-max)",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)"],
        heading: ["var(--font-display)"],
      },
      screens: {
        md: "620px",
        lg: "1024px",
      },
      spacing: {
        0: "var(--space-0)",
        1: "var(--space-4)",
        2: "var(--space-8)",
        3: "var(--space-12)",
        4: "var(--space-16)",
        6: "var(--space-24)",
        8: "var(--space-32)",
        10: "var(--space-40)",
        13: "var(--space-52)",
        16: "var(--space-64)",
        20: "var(--space-80)",
        30: "var(--space-120)",
        40: "var(--space-160)",
      },
    },
  },
  plugins: [],
};

export default config;
