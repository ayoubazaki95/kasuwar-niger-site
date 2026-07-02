import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#15191B",
        inkSoft: "#5B6566",
        paper: "#FFFFFF",
        mist: "#F2F5F4",
        line: "#E7EBEA",
        orange: { DEFAULT: "#F5740F", dark: "#D9620A" },
        green: { DEFAULT: "#129447", dark: "#0E7A3A" },
        gold: "#F2A93B",
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
