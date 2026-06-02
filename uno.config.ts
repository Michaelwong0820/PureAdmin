import { defineConfig, presetUno } from "unocss";

import { presetIcons } from "unocss";
export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      collections: {
        carbon: () => import("@iconify-json/carbon/icons.json")
      }
    })
  ],
  theme: {
    colors: {
      bg_color: "var(--el-bg-color)",
      primary: "var(--el-color-primary)",
      text_color_primary: "var(--el-text-color-primary)",
      text_color_regular: "var(--el-text-color-regular)"
    }
  },
  shortcuts: {
    "flex-c": "flex justify-center items-center",
    "flex-ac": "flex justify-around items-center",
    "flex-bc": "flex justify-between items-center",
    "navbar-bg-hover": "select-none dark:text-white dark:hover:bg-[#242424]!"
  },
  rules: [
    [
      "animate-scale-bounce",
      {
        animation: "pure-scale-bounce 0.3s ease-in-out"
      }
    ]
  ],
  preflights: [
    {
      getCSS: () => `
        @keyframes pure-scale-bounce {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
      `
    }
  ]
});
