import { $t } from "@/plugins/i18n";
import { permission } from "@/router/enums";

const Layout = () => import("@/layout/index.vue");

export default {
  path: "/permission",
  name: "Permission",
  component: Layout,
  redirect: "/permission/page",
  meta: {
    icon: "ep/guide",
    title: $t("menus.purePermission"),
    rank: permission,
    roles: ["admin", "common"]
  },
  children: [
    {
      path: "/permission/page",
      name: "PermissionPage",
      component: () => import("@/views/permission/page/index.vue"),
      meta: {
        title: $t("menus.purePermissionPage"),
        roles: ["admin", "common"]
      }
    },
    {
      path: "/permission/button",
      name: "PermissionButton",
      component: () => import("@/views/permission/button/index.vue"),
      meta: {
        title: $t("menus.purePermissionButton"),
        roles: ["admin", "common"]
      }
    }
  ]
} satisfies RouteConfigsTable;
