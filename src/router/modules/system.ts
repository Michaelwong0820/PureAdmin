import { $t } from "@/plugins/i18n";
import { system } from "@/router/enums";

const Layout = () => import("@/layout/index.vue");

export default {
  path: "/system",
  name: "System",
  component: Layout,
  redirect: "/system/user",
  meta: {
    icon: "ep/set-up",
    title: $t("menus.pureSysManagement"),
    rank: system,
    roles: ["admin"]
  },
  children: [
    {
      path: "/system/user",
      name: "SystemUser",
      component: () => import("@/views/system/user/index.vue"),
      meta: {
        title: $t("menus.pureUser"),
        roles: ["admin"]
      }
    },
    {
      path: "/system/role",
      name: "SystemRole",
      component: () => import("@/views/system/role/index.vue"),
      meta: {
        title: $t("menus.pureRole"),
        roles: ["admin"]
      }
    },
    {
      path: "/system/menu",
      name: "SystemMenu",
      component: () => import("@/views/system/menu/index.vue"),
      meta: {
        title: $t("menus.pureSystemMenu"),
        roles: ["admin"]
      }
    }
  ]
} satisfies RouteConfigsTable;
