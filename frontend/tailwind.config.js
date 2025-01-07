/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      padding: {
        "calc-full": "calc(100vw - 100%)", // Add your custom padding
      },
    },
  },
  plugins: [],
};
