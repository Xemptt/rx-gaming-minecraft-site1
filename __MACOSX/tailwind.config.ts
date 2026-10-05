import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Since you are adding a dark mode toggle!
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./component/**/*.{js,ts,jsx,tsx,mdx}", // Matches your custom "component" folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
