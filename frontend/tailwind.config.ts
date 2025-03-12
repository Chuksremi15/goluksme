import type { Config } from "tailwindcss";
const { heroui } = require("@heroui/react");

const scrollbarHide = ({
  addUtilities,
}: {
  addUtilities: (utilities: { [key: string]: any }) => void;
}) =>
  addUtilities({
    ".scrollbar-hide": {
      // TODO: remove IE and Edge support
      /* IE and Edge */
      "-ms-overflow-style": "none",
      /* Firefox */
      "scrollbar-width": "none",
      /* Safari and Chrome */
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
    ".scrollbar-default": {
      // TODO: remove IE and Edge support
      /* IE and Edge */
      "-ms-overflow-style": "auto",
      /* Firefox */
      "scrollbar-width": "auto",
      /* Safari and Chrome */
      "&::-webkit-scrollbar": {
        display: "block",
      },
    },
  });

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    heroui({
      prefix: "nextui", // prefix for themes variables
      addCommonColors: false, // override common colors (e.g. "blue", "green", "pink").
      defaultTheme: "light", // default theme from the themes object
      defaultExtendTheme: "light", // default theme to extend on custom themes
      layout: {}, // common layout tokens (applied to all themes)
      themes: {
        light: {
          layout: {}, // light theme layout tokens
          colors: {
            darkBlue: "#17073d",
            black: "#000000",
            danger: "#DD4B4B",
            purple: "#806DC5",
            red: "#DD4B4B",
            tablebg: "#17181B",
            dark: "#111111",
            orange: "#cc480c",
          },
        },
        dark: {
          layout: {}, // dark theme layout tokens
          colors: {
            darkBlue: "#17073d",
            black: "#000000",
            danger: "#DD4B4B",
            purple: "#806DC5",
            red: "#DD4B4B",
            tablebg: "#17181B",
            dark: "#111111",
            orange: "#cc480c",
          }, // dark theme color
        },
        // ... custom themes
      },
    }),
    scrollbarHide,
  ],
} satisfies Config;
