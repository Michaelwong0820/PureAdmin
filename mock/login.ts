import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([
  {
    url: "/login",
    method: "post",
    response: ({ body }) => {
      const username = body.username === "common" ? "common" : "admin";

      if (username === "admin") {
        return {
          code: 0,
          message: "操作成功",
          data: {
            avatar: "",
            username: "admin",
            nickname: "系统管理员",
            roles: ["admin"],
            permissions: [
              "permission:btn:add",
              "permission:btn:edit",
              "permission:btn:delete"
            ],
            accessToken: "lightweight-admin-token",
            refreshToken: "lightweight-admin-refresh-token",
            expires: "2036/10/30 00:00:00"
          }
        };
      }

      return {
        code: 0,
        message: "操作成功",
        data: {
          avatar: "",
          username: "common",
          nickname: "普通成员",
          roles: ["common"],
          permissions: ["permission:btn:add", "permission:btn:edit"],
          accessToken: "lightweight-common-token",
          refreshToken: "lightweight-common-refresh-token",
          expires: "2036/10/30 00:00:00"
        }
      };
    }
  }
]);
