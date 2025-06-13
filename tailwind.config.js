module.exports = {
  content: ["./client/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".grid-areas-layout": {
          display: "grid",
          gridTemplateAreas: `"pfp info"`,
        },
        ".area-pfp": {
          gridArea: "pfp",
        },
        ".area-info": {
          gridArea: "info",
        },
      });
    },
  ],
};
