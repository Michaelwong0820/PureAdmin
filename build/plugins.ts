import { pathResolve } from "./utils";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import { viteBuildInfo } from "./info";
import svgLoader from "vite-svg-loader";
import Icons from "unplugin-icons/vite";
import AutoImport from "unplugin-auto-import/vite";
import type { PluginOption } from "vite";
import { configCompressPlugin } from "./compress";
import removeNoMatch from "vite-plugin-router-warn";
import { visualizer } from "rollup-plugin-visualizer";
import removeConsole from "vite-plugin-remove-console";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import { codeInspectorPlugin } from "code-inspector-plugin";
import { vitePluginFakeServer } from "vite-plugin-fake-server";

export async function getPluginsList(
  _VITE_CDN: boolean,
  VITE_COMPRESSION: ViteCompression
): Promise<PluginOption[]> {
  const lifecycle = process.env.npm_lifecycle_event;
  return [
    UnoCSS(),
    AutoImport({
      imports: ["vue", "vue-router", "pinia"],
      dts: pathResolve("../types/auto-imports.d.ts"),
      eslintrc: {
        enabled: true,
        filepath: pathResolve("../types/auto-imports.json")
      },
      vueTemplate: false
    }),
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag === "deep-chat"
        }
      }
    }),
    VueI18nPlugin({
      include: [pathResolve("../locales/**")]
    }),
    codeInspectorPlugin({
      bundler: "vite",
      hideConsole: true
    }),
    viteBuildInfo(),
    removeNoMatch(),
    vitePluginFakeServer({
      logger: false,
      include: "mock",
      infixName: false,
      enableProd: true
    }),
    svgLoader(),
    Icons({
      compiler: "vue3",
      scale: 1
    }),
    configCompressPlugin(VITE_COMPRESSION),
    removeConsole(),
    lifecycle === "report"
      ? visualizer({ open: true, brotliSize: true, filename: "report.html" })
      : (null as any)
  ];
}
