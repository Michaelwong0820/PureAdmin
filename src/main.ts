import App from "./App.vue";
import router from "./router";
import { setupStore } from "@/store";
import { useI18n } from "@/plugins/i18n";
import { getPlatformConfig } from "./config";
import { createApp, type Directive } from "vue";
import { useElementPlus } from "@/plugins/elementPlus";
import { injectResponsiveStorage } from "@/utils/responsive";

import "./style/reset.scss";
import "./style/index.scss";
import "uno.css";
import "element-plus/dist/index.css";
import "./assets/iconfont/iconfont.css";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";

const app = createApp(App);

import * as directives from "@/directives";
Object.keys(directives).forEach(key => {
  app.directive(key, (directives as { [key: string]: Directive })[key]);
});

import { Auth } from "@/components/ReAuth";
import { Perms } from "@/components/RePerms";
import {
  IconifyIconOffline,
  IconifyIconOnline,
  FontIcon
} from "@/components/ReIcon";
app.component("Auth", Auth);
app.component("Perms", Perms);
app.component("IconifyIconOffline", IconifyIconOffline);
app.component("IconifyIconOnline", IconifyIconOnline);
app.component("FontIcon", FontIcon);

import VueTippy from "vue-tippy";

getPlatformConfig(app).then(async config => {
  setupStore(app);
  app.use(router);
  await router.isReady();
  injectResponsiveStorage(app, config);
  app.use(VueTippy);
  app.use(useI18n);
  app.use(useElementPlus);
  app.mount("#app");
});
