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
        parchment: {
          50: "#FAF9F6",
          100: "#F5F3EF",
          200: "#EAE6DF",
          300: "#DCD5C9",
          400: "#B8AC97",
        },
        ink: {
          900: "#1C1917",
          800: "#292524",
          700: "#44403C",
          500: "#78716C",
          400: "#A8A29E",
        },
        amber: {
          accent: "#C25E00",
          warm: "#D97706",
          light: "#FEF3C7",
        },
        forest: {
          accent: "#1B4D3E",
          emerald: "#065F46",
          light: "#ECFDF5",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
        serif: ["Newsreader", "Georgia", "serif"],
      },
      boxShadow: {
        tactile: "0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
        "tactile-hover": "0 4px 12px rgba(28, 25, 23, 0.06), 0 1px 3px rgba(28, 25, 23, 0.04)",
        card: "0 1px 2px rgba(0,0,0,0.03), 0 0 0 1px rgba(231, 229, 228, 0.8)",
      },
    },
  },
  plugins: [],
};
export default config;
