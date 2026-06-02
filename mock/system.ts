import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([
  {
    url: "/user",
    method: "post",
    response: ({ body }) => {
      let list = [
        {
          username: "admin",
          nickname: "系统管理员",
          phone: "15800000001",
          email: "admin@example.com",
          id: 1,
          status: 1,
          roles: ["admin"],
          createTime: "2026-06-01 09:00:00"
        },
        {
          username: "common",
          nickname: "普通成员",
          phone: "15800000002",
          email: "common@example.com",
          id: 2,
          status: 1,
          roles: ["common"],
          createTime: "2026-06-01 10:30:00"
        },
        {
          username: "auditor",
          nickname: "审计员",
          phone: "15800000003",
          email: "auditor@example.com",
          id: 3,
          status: 0,
          roles: ["common"],
          createTime: "2026-06-02 08:00:00"
        }
      ];
      list = list.filter(item => item.username.includes(body?.username ?? ""));
      list = list.filter(item =>
        String(item.status).includes(String(body?.status))
      );
      if (body.phone) list = list.filter(item => item.phone === body.phone);
      return {
        code: 0,
        message: "操作成功",
        data: {
          list,
          total: list.length,
          pageSize: 10,
          currentPage: 1
        }
      };
    }
  },
  {
    url: "/list-all-role",
    method: "get",
    response: () => {
      return {
        code: 0,
        message: "操作成功",
        data: [
          { id: 1, name: "管理员" },
          { id: 2, name: "普通成员" }
        ]
      };
    }
  },
  {
    url: "/list-role-ids",
    method: "post",
    response: ({ body }) => {
      if (body.userId) {
        return {
          code: 0,
          message: "操作成功",
          data: body.userId == 1 ? [1] : [2]
        };
      }
      return {
        code: 10001,
        message: "请求参数缺失或格式不正确",
        data: []
      };
    }
  },
  {
    url: "/role",
    method: "post",
    response: ({ body }) => {
      let list = [
        {
          id: 1,
          name: "管理员",
          code: "admin",
          status: 1,
          remark: "管理员拥有全部菜单与按钮权限"
        },
        {
          id: 2,
          name: "普通成员",
          code: "common",
          status: 1,
          remark: "普通成员仅可访问首页与权限演示页"
        }
      ];
      list = list.filter(item => item.name.includes(body?.name ?? ""));
      list = list.filter(item =>
        String(item.status).includes(String(body?.status))
      );
      if (body.code) list = list.filter(item => item.code === body.code);
      return {
        code: 0,
        message: "操作成功",
        data: {
          list,
          total: list.length,
          pageSize: 10,
          currentPage: 1
        }
      };
    }
  },
  {
    url: "/role-menu",
    method: "post",
    response: () => {
      return {
        code: 0,
        message: "操作成功",
        data: [
          {
            parentId: 0,
            id: 1,
            title: "首页"
          },
          {
            parentId: 0,
            id: 2,
            title: "系统管理",
            children: [
              {
                parentId: 2,
                id: 21,
                title: "用户管理"
              },
              {
                parentId: 2,
                id: 22,
                title: "角色管理"
              },
              {
                parentId: 2,
                id: 23,
                title: "菜单管理"
              }
            ]
          },
          {
            parentId: 0,
            id: 3,
            title: "角色权限",
            children: [
              {
                parentId: 3,
                id: 31,
                title: "页面权限"
              },
              {
                parentId: 3,
                id: 32,
                title: "按钮权限"
              }
            ]
          }
        ]
      };
    }
  },
  {
    url: "/role-menu-ids",
    method: "post",
    response: ({ body }) => {
      return {
        code: 0,
        message: "操作成功",
        data:
          body.roleId === 1
            ? [1, 2, 21, 22, 23, 3, 31, 32]
            : [1, 3, 31, 32]
      };
    }
  },
  {
    url: "/menu",
    method: "post",
    response: ({ body }) => {
      const list = [
        {
          id: 1,
          title: "首页",
          path: "/welcome",
          rolesText: "admin / common",
          typeText: "菜单"
        },
        {
          id: 2,
          title: "系统管理",
          path: "/system",
          rolesText: "admin",
          typeText: "目录",
          children: [
            {
              id: 21,
              title: "用户管理",
              path: "/system/user",
              rolesText: "admin",
              typeText: "菜单"
            },
            {
              id: 22,
              title: "角色管理",
              path: "/system/role",
              rolesText: "admin",
              typeText: "菜单"
            },
            {
              id: 23,
              title: "菜单管理",
              path: "/system/menu",
              rolesText: "admin",
              typeText: "菜单"
            }
          ]
        },
        {
          id: 3,
          title: "角色权限",
          path: "/permission",
          rolesText: "admin / common",
          typeText: "目录",
          children: [
            {
              id: 31,
              title: "页面权限",
              path: "/permission/page",
              rolesText: "admin / common",
              typeText: "菜单"
            },
            {
              id: 32,
              title: "按钮权限",
              path: "/permission/button",
              rolesText: "admin / common",
              typeText: "菜单"
            }
          ]
        }
      ];
      const keyword = body?.title ?? "";
      const filtered = keyword
        ? list.filter(item => {
            if (item.title.includes(keyword)) return true;
            return item.children?.some(child => child.title.includes(keyword));
          })
        : list;
      return {
        code: 0,
        message: "操作成功",
        data: filtered
      };
    }
  }
]);
