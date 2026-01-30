/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "rgb(var(--bg-base) / <alpha-value>)",
        surface: "rgb(var(--bg-surface) / <alpha-value>)",
        elevated: "rgb(var(--bg-elevated) / <alpha-value>)",
        muted: "rgb(var(--bg-muted) / <alpha-value>)",
        border: "rgb(var(--border-base) / <alpha-value>)",
        "border-muted": "rgb(var(--border-muted) / <alpha-value>)",
      },
      textColor: {
        primary: "rgb(var(--text-base) / <alpha-value>)",
        muted: "rgb(var(--text-muted) / <alpha-value>)",
        subtle: "rgb(var(--text-subtle) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
