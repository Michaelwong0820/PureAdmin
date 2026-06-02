import Cookies from "js-cookie";
import { storageLocal, isString, isIncludeAllChildren } from "@pureadmin/utils";

export interface DataInfo<T> {
  accessToken: string;
  expires: T;
  refreshToken: string;
  avatar?: string;
  username?: string;
  nickname?: string;
  roles?: Array<string>;
  permissions?: Array<string>;
}

export const userKey = "user-info";
export const TokenKey = "authorized-token";

export function getToken(): DataInfo<number> {
  const cookieValue = Cookies.get(TokenKey);
  return cookieValue ? JSON.parse(cookieValue) : storageLocal().getItem(userKey);
}

export function setToken(data: DataInfo<Date>) {
  const { accessToken, refreshToken } = data;
  const expires = new Date(data.expires).getTime();
  Cookies.set(
    TokenKey,
    JSON.stringify({
      accessToken,
      expires,
      refreshToken
    }),
    {
      expires: (expires - Date.now()) / 86400000
    }
  );
  storageLocal().setItem(userKey, {
    refreshToken,
    expires,
    avatar: data?.avatar ?? "",
    username: data?.username ?? "",
    nickname: data?.nickname ?? "",
    roles: data?.roles ?? [],
    permissions: data?.permissions ?? []
  });
}

export function removeToken() {
  Cookies.remove(TokenKey);
  storageLocal().removeItem(userKey);
}

export const formatToken = (token: string): string => {
  return "Bearer " + token;
};

export const hasPerms = (value: string | Array<string>): boolean => {
  if (!value) return false;
  const permissions =
    storageLocal().getItem<DataInfo<number>>(userKey)?.permissions ?? [];
  if (!permissions.length) return false;
  const isAuths = isString(value)
    ? permissions.includes(value)
    : isIncludeAllChildren(value, permissions);
  return isAuths ? true : false;
};
