import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px', // Extra small phones
      },
      colors: {
        brand: {
          blush: "#F8C8DC",
          "rose-deep": "#E75480",
          sage: "#9CAF88",
          green: "#E75480",
          pink: "#E75480",
          purple: "#9C27B0",
          gold: "#D4AF37",
          teal: "#17a2b8",
          orange: "#ff4d00",
          red: "#E75480",
          white: "#ffffff",
          gray: {
            50: "#f9fafb",
            100: "#f3f4f6",
            200: "#e5e7eb",
            800: "#1f2937",
            900: "#111827",
          },
          cream: "#F9F2E8",
          "cream-light": "#FFFBF7",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["Roboto Mono", "monospace"],
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        cardHover: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;

