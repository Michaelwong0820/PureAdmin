# Project Rules

## Product Scope

- This repository is a slimmed Vue 3 + Vite + Element Plus admin.
- Only these business areas are in scope:
  - 登录
  - 首页
  - 用户管理
  - 角色管理
  - 菜单管理
  - 页面权限
  - 按钮权限
- Do not restore removed demo modules unless explicitly requested.

## Framework Rules

- Keep UnoCSS.
- Do not reintroduce TailwindCSS.
- Preserve the current pure-admin shell and layout style.
- Prefer Element Plus + lightweight UnoCSS utility usage.

## Routing Rules

- Routes must be maintained through `src/router/modules`.
- Do not switch back to a hand-maintained central route table.
- Keep `/login` and `/redirect` in `src/router/modules/remaining.ts`.
- After login or role switching, initialize menus through `initRouter(...)`.

## Permission Rules

- Page access is controlled by `meta.roles`.
- Button access is controlled by login response `permissions`.
- Keep current role model:
  - `admin`: full retained modules
  - `common`: home + permission demo only
- If permission behavior changes, update route meta and mock data together.

## Data Rules

- Current demo data is mock-driven.
- When changing retained management pages, keep these files in sync:
  - `src/api/system.ts`
  - `mock/system.ts`
  - corresponding page in `src/views/system/*`

## Implementation Rules

- Prefer explicit imports in Vue files even though auto-import is configured.
- Keep forms, tables, and dialogs simple.
- Avoid reintroducing deleted heavy abstractions from the original full template.
- Reuse current stores and router helpers before adding new global state.

## Validation Rules

- Always run:
  - `vue-tsc --noEmit --skipLibCheck`
  - `vite build`
- For auth, routing, or permission changes, also verify:
  - unauthenticated redirect to login
  - login success redirect
  - role switch updates menus

