/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Inter",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        ink: {
          DEFAULT: "#1d1d1f",
          soft: "#6e6e73",
        },
        chalk: "#f5f5f7",
        accent: {
          DEFAULT: "#ff6a1a",
          hover: "#f25c0a",
        },
      },
      maxWidth: {
        page: "1120px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.16,1,0.3,1) forwards",
        marquee: "marquee 32s linear infinite",
      },
    },
  },
  plugins: [],
};
