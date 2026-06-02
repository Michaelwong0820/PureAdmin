import { getToken } from "@/utils/auth";
import { getConfig } from "@/config";
import NProgress from "@/utils/progress";
import { buildHierarchyTree } from "@/utils/tree";
import { transformI18n } from "@/plugins/i18n";
import remainingRouter from "./modules/remaining";
import { usePermissionStoreHook } from "@/store/modules/permission";
import {
  ascending,
  initRouter,
  getHistoryMode,
  hasRouteAccess,
  getDefaultRoutePath,
  formatTwoStageRoutes,
  formatFlatteningRoutes
} from "./utils";
import { type RouteRecordRaw, type RouteComponent, createRouter } from "vue-router";

const modules: Record<string, any> = import.meta.glob(
  ["./modules/**/*.ts", "!./modules/**/remaining.ts"],
  {
    eager: true
  }
);

const routes: Array<RouteRecordRaw> = [];

Object.keys(modules).forEach(key => {
  routes.push(modules[key].default);
});

export const constantRoutes: Array<RouteRecordRaw> = formatTwoStageRoutes(
  formatFlatteningRoutes(buildHierarchyTree(ascending(routes.flat(Infinity))))
);

export const constantMenus: Array<RouteComponent | RouteRecordRaw> = ascending(
  routes.flat(Infinity)
).concat(...remainingRouter);

export const remainingPaths = remainingRouter.map(item => item.path);

export const router = createRouter({
  history: getHistoryMode(import.meta.env.VITE_ROUTER_HISTORY),
  routes: constantRoutes.concat(
    ...(remainingRouter as any),
    {
      path: "/:pathMatch(.*)*",
      redirect: () => {
        return getToken() ? getDefaultRoutePath() : "/login";
      },
      meta: {
        title: "",
        showLink: false
      }
    }
  ),
  strict: true,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (from.meta?.saveSrollTop) {
      const top = document.documentElement.scrollTop || document.body.scrollTop;
      return { left: 0, top };
    }
    return { left: 0, top: 0 };
  }
});

const whiteList = ["/login"];

router.beforeEach(async to => {
  NProgress.start();

  const token = getToken();
  const externalTitle = to.matched.find(item => item.meta?.title)?.meta?.title;
  const title = getConfig().Title;
  if (externalTitle) {
    document.title = title
      ? `${transformI18n(externalTitle)} | ${title}`
      : transformI18n(externalTitle);
  }

  if (!token) {
    if (whiteList.includes(to.path)) return true;
    return {
      path: "/login",
      query: {
        redirect: to.fullPath
      }
    };
  }

  if (to.path === "/login") {
    return getDefaultRoutePath();
  }

  if (usePermissionStoreHook().wholeMenus.length === 0) {
    await initRouter(to.path);
  }

  if (to.meta?.roles && !hasRouteAccess(to.meta.roles as string[])) {
    return getDefaultRoutePath();
  }

  return true;
});

router.afterEach(() => {
  NProgress.done();
});

export function resetRouter() {
  usePermissionStoreHook().clearAllCachePage();
}

export default router;
