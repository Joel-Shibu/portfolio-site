/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        foreground: "#09090B",
        surface: {
          DEFAULT: "#FAFAFA",
          50: "#FAFAFA",
          100: "#F4F4F5",
          200: "#E4E4E7",
          300: "#D4D4D8",
        },
        primary: "#18181B",
        accent: {
          DEFAULT: "#0284C7",
          blue: "#0284C7",
          cyan: "#0EA5E9",
          silver: "#94A3B8",
        },
        muted: "#71717A",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        clean: "0 1px 3px rgba(0,0,0,0.04), 0 10px 25px -5px rgba(0,0,0,0.03)",
        float: "0 20px 40px -15px rgba(0,0,0,0.06), 0 0 1px 1px rgba(0,0,0,0.04)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;