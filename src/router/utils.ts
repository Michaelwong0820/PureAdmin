import {
  type RouterHistory,
  type RouteRecordRaw,
  type RouteComponent,
  createWebHistory,
  createWebHashHistory
} from "vue-router";
import { router, constantMenus } from "./index";
import { isProxy, toRaw } from "vue";
import { useTimeoutFn } from "@vueuse/core";
import {
  isString,
  cloneDeep,
  intersection,
  storageLocal,
  isIncludeAllChildren
} from "@pureadmin/utils";
import { buildHierarchyTree } from "@/utils/tree";
import { userKey, type DataInfo } from "@/utils/auth";
import { type menuType, routerArrays } from "@/layout/types";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { usePermissionStoreHook } from "@/store/modules/permission";

function handRank(routeInfo: any) {
  const { name, path, parentId, meta } = routeInfo;
  return parentId == null
    ? meta?.rank == null || (meta?.rank === 0 && name !== "Home" && path !== "/")
    : false;
}

export function ascending(arr: any[]) {
  arr.forEach((item, index) => {
    if (handRank(item)) item.meta.rank = index + 2;
  });
  return arr.sort((a, b) => a?.meta.rank - b?.meta.rank);
}

export function filterTree(data: RouteComponent[]) {
  const newTree = cloneDeep(data).filter(
    (item: { meta: { showLink: boolean } }) => item.meta?.showLink !== false
  );
  newTree.forEach((item: { children }) => {
    if (item.children) item.children = filterTree(item.children);
  });
  return newTree;
}

function filterChildrenTree(data: RouteComponent[]) {
  const newTree = cloneDeep(data).filter((item: any) => item?.children?.length !== 0);
  newTree.forEach((item: { children }) => {
    if (item.children) item.children = filterTree(item.children);
  });
  return newTree;
}

export function isOneOfArray(a?: string[], b?: string[]) {
  return Array.isArray(a) && Array.isArray(b)
    ? intersection(a, b).length > 0
    : true;
}

export function hasRouteAccess(required?: string[]) {
  const currentRoles =
    storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? [];
  return !required?.length || isOneOfArray(required, currentRoles);
}

export function filterNoPermissionTree(data: RouteComponent[]) {
  const currentRoles =
    storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? [];
  const newTree = cloneDeep(data).filter((item: any) =>
    isOneOfArray(item.meta?.roles, currentRoles)
  );
  newTree.forEach((item: any) => {
    if (item.children) item.children = filterNoPermissionTree(item.children);
  });
  return filterChildrenTree(newTree);
}

export function getParentPaths(
  value: string,
  routes: RouteRecordRaw[],
  key = "path"
) {
  function dfs(source: RouteRecordRaw[], target: string, parents: string[]) {
    for (let index = 0; index < source.length; index += 1) {
      const item = source[index];
      if (item[key] === target) return parents;
      if (!item.children?.length) continue;
      parents.push(item.path);
      if (dfs(item.children, target, parents).length) return parents;
      parents.pop();
    }
    return [];
  }

  return dfs(routes, value, []);
}

export function findRouteByPath(path: string, routes: readonly RouteRecordRaw[]) {
  let result = routes.find((item: { path: string }) => item.path === path);
  if (result) {
    return isProxy(result) ? toRaw(result) : result;
  }
  for (let index = 0; index < routes.length; index += 1) {
    if (routes[index].children instanceof Array && routes[index].children.length > 0) {
      result = findRouteByPath(path, routes[index].children);
      if (result) return isProxy(result) ? toRaw(result) : result;
    }
  }
  return null;
}

export function formatFlatteningRoutes(routesList: RouteRecordRaw[]) {
  if (routesList.length === 0) return routesList;
  let hierarchyList = buildHierarchyTree(routesList);
  for (let index = 0; index < hierarchyList.length; index += 1) {
    if (hierarchyList[index].children) {
      hierarchyList = hierarchyList
        .slice(0, index + 1)
        .concat(hierarchyList[index].children, hierarchyList.slice(index + 1));
    }
  }
  return hierarchyList;
}

export function formatTwoStageRoutes(routesList: RouteRecordRaw[]) {
  if (routesList.length === 0) return routesList;
  const newRoutesList: RouteRecordRaw[] = [];
  routesList.forEach((item: RouteRecordRaw) => {
    if (item.path === "/") {
      newRoutesList.push({
        component: item.component,
        name: item.name,
        path: item.path,
        redirect: item.redirect,
        meta: item.meta,
        children: []
      });
    } else {
      newRoutesList[0]?.children.push({ ...item });
    }
  });
  return newRoutesList;
}

export function handleAliveRoute({ name }: ToRouteType, mode?: string) {
  switch (mode) {
    case "add":
      usePermissionStoreHook().cacheOperate({ mode: "add", name });
      break;
    case "delete":
      usePermissionStoreHook().cacheOperate({ mode: "delete", name });
      break;
    case "refresh":
      usePermissionStoreHook().cacheOperate({ mode: "refresh", name });
      break;
    default:
      usePermissionStoreHook().cacheOperate({ mode: "delete", name });
      useTimeoutFn(() => {
        usePermissionStoreHook().cacheOperate({ mode: "add", name });
      }, 100);
  }
}

export function getHistoryMode(routerHistory: string): RouterHistory {
  const historyMode = routerHistory.split(",");
  const leftMode = historyMode[0];
  const rightMode = historyMode[1];
  if (historyMode.length === 1) {
    return leftMode === "hash" ? createWebHashHistory("") : createWebHistory("");
  }
  return leftMode === "hash"
    ? createWebHashHistory(rightMode)
    : createWebHistory(rightMode);
}

export function getAuths(): Array<string> {
  return storageLocal().getItem<DataInfo<number>>(userKey)?.permissions ?? [];
}

export function hasAuth(value: string | Array<string>): boolean {
  if (!value) return false;
  const auths = getAuths();
  if (!auths.length) return false;
  return isString(value)
    ? auths.includes(value)
    : isIncludeAllChildren(value, auths);
}

export function getMenuRoutes() {
  if (usePermissionStoreHook().wholeMenus.length > 0) {
    return cloneDeep(usePermissionStoreHook().wholeMenus);
  }
  return filterNoPermissionTree(filterTree(ascending(constantMenus)));
}

function handleTopMenu(route: any) {
  if (route?.children && route.children.length > 0) {
    if (route.redirect) {
      return route.children.find(child => child.path === route.redirect) ?? route.children[0];
    }
    return route.children[0];
  }
  return route;
}

export function getTopMenu(tag = false): menuType {
  const topMenu = handleTopMenu(getMenuRoutes()[0]);
  if (tag && topMenu) {
    useMultiTagsStoreHook().handleTags("push", {
      path: topMenu.path,
      name: topMenu.name,
      meta: topMenu.meta
    });
  }
  return topMenu;
}

export function getDefaultRoutePath() {
  return getTopMenu()?.path || "/welcome";
}

export async function initRouter(path?: string) {
  usePermissionStoreHook().handleWholeMenus([]);
  if (!useMultiTagsStoreHook().getMultiTagsCache) {
    useMultiTagsStoreHook().handleTags("equal", [
      ...routerArrays,
      ...usePermissionStoreHook().flatteningRoutes.filter(v => v?.meta?.fixedTag)
    ] as any);
  }

  const currentPath = path || router.currentRoute.value.path || getDefaultRoutePath();
  const currentRoute = findRouteByPath(currentPath, router.options.routes);
  const routeState =
    router.currentRoute.value.path === currentPath ? router.currentRoute.value : null;
  if (currentRoute?.meta?.title) {
    useMultiTagsStoreHook().handleTags("push", {
      path: currentRoute.path,
      name: currentRoute.name,
      meta: currentRoute.meta,
      query: routeState?.query,
      params: routeState?.params
    });
  }

  return router;
}
