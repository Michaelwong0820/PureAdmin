import { defineStore } from "pinia";
import { type userType, store, storageLocal } from "../utils";
import { type UserResult, getLogin } from "@/api/user";
import { router } from "@/router";
import { type DataInfo, removeToken, userKey } from "@/utils/auth";

export const useUserStore = defineStore("pure-user", {
  state: (): userType => ({
    avatar: storageLocal().getItem<DataInfo<number>>(userKey)?.avatar ?? "",
    username: storageLocal().getItem<DataInfo<number>>(userKey)?.username ?? "",
    nickname: storageLocal().getItem<DataInfo<number>>(userKey)?.nickname ?? "",
    roles: storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? [],
    permissions:
      storageLocal().getItem<DataInfo<number>>(userKey)?.permissions ?? [],
    isRemembered: false,
    loginDay: 7
  }),
  actions: {
    SET_AVATAR(avatar: string) {
      this.avatar = avatar;
    },
    SET_USERNAME(username: string) {
      this.username = username;
    },
    SET_NICKNAME(nickname: string) {
      this.nickname = nickname;
    },
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    SET_PERMS(permissions: Array<string>) {
      this.permissions = permissions;
    },
    SET_ISREMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },
    SET_LOGINDAY(value: number) {
      this.loginDay = Number(value);
    },
    async loginByUsername(data) {
      return new Promise<UserResult>((resolve, reject) => {
        getLogin(data)
          .then(result => {
            if (result.code === 0) {
              resolve(result);
            } else {
              reject(result.message);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    setUserInfo(data: UserResult["data"]) {
      this.SET_AVATAR(data.avatar);
      this.SET_USERNAME(data.username);
      this.SET_NICKNAME(data.nickname);
      this.SET_ROLES(data.roles);
      this.SET_PERMS(data.permissions);
    },
    logOut() {
      this.avatar = "";
      this.username = "";
      this.nickname = "";
      this.roles = [];
      this.permissions = [];
      removeToken();
      router.push("/login");
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
