/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Note the addition of the `app` directory.
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      unselected: "#0B1C2F80",
      blue: "#007BC0",
      shadow: "#5C676F",
      secondary: "#4CB7D9",
      primary: "#1E90FF",
      black: "#000000",
      white: "#FFFFFF",
      red: "#e55252",
      green: "#1db454",
      devRed: "#FF0000",
      devGreen: "#00FF00",
      devBlue: "#0000FF",
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
};
