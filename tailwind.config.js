/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Add custom "noScrollbar" class to hide scrollbars
      spacing: {
        noScrollbar: {
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      },
    },
  },
  plugins: [],
};
