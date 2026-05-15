/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Aura "Windy Beach" palette
        sand: "#F5F5F2",        // Soft Sand (background)
        slate: "#37474F",       // Wet Slate (text)
        sky: "#81D4FA",         // Light Sky Blue (primary action)
        orange: "#FFA726",      // Sunlight Orange (accent)
        glass: "rgba(255, 255, 255, 0.8)", // Frosted Sea Glass
      },
      borderRadius: {
        glass: "40px",  // rounded-[40px]
        pebble: "32px", // rounded-[32px]
      },
      spacing: {
        sand: "1px",
      },
    },
  },
  plugins: [],
};
