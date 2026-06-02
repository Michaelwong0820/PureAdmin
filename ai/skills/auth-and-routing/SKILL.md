---
name: auth-and-routing
description: Use when working on login, token persistence, route guards, menu initialization, redirects, or page entry flow in this slimmed pure-admin project.
---

# Auth And Routing

Use this skill for anything related to login flow, menu bootstrap, redirect behavior, or route permissions.

## Scope

- Login page: `src/views/login/index.vue`
- User auth store: `src/store/modules/user.ts`
- Token helpers: `src/utils/auth.ts`
- Router bootstrap: `src/router/index.ts`
- Router helpers: `src/router/utils.ts`
- Static route modules: `src/router/modules/*.ts`
- Permission/menu stores: `src/store/modules/permission.ts`, `src/store/modules/multiTags.ts`
- Login mock: `mock/login.ts`

## Current Project Model

- Routes are auto-loaded from `src/router/modules`.
- Only these functional areas are retained:
  - login
  - welcome/home
  - permission page
  - permission button
  - system user
  - system role
  - system menu
- `remaining.ts` only contains `/login` and `/redirect`.
- After login or role switch, call `initRouter(...)` before navigating so menus and tags are rebuilt.

## Role Model

- `admin` can access:
  - `/welcome`
  - `/permission/page`
  - `/permission/button`
  - `/system/user`
  - `/system/role`
  - `/system/menu`
- `common` can access:
  - `/welcome`
  - `/permission/page`
  - `/permission/button`

## Change Rules

- When adding a page, register it by creating or updating a file in `src/router/modules`, not by hand-writing a central route list.
- Keep `meta.roles` aligned with the actual role behavior in `mock/login.ts`.
- If login payload fields change, update both:
  - `mock/login.ts`
  - `src/utils/auth.ts`
- If redirect behavior changes, verify:
  - direct open without token
  - open `/login` with token
  - role switch from permission page

## Validation

- Run `vue-tsc --noEmit --skipLibCheck`
- Run `vite build`

