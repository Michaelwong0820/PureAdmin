import { http } from "@/utils/http";

export type UserResult = {
  code: number;
  message: string;
  data: {
    avatar: string;
    username: string;
    nickname: string;
    roles: Array<string>;
    permissions: Array<string>;
    accessToken: string;
    refreshToken: string;
    expires: Date;
  };
};

export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", "/login", { data });
};
