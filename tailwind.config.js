/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./script.js", "./data.js"],
  theme: {
    extend: {
      // Thème NEUTRE de départ.
      // TODO (Partie 1) : remplacez ces valeurs par les couleurs et les polices de votre univers.
      colors: {
        brand: {
          DEFAULT: "#D97706",
          dark: "#B45309",
          light: "#FEF3C7",
        },
        ink: "#1F1135",
        muted: "#78716C",
        ground: "#FAF7F2",
        line: "#E7E5E4",
      },
      fontFamily: {
        display: ["Arial", "sans-serif"],
        body: ["Arial", "sans-serif"],
        mono: ["Courier New", "monospace"],
      },
      borderRadius: {
        card: "20px",
      },
    },
  },
  plugins: [],
};
