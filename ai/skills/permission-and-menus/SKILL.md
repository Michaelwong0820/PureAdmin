---
name: permission-and-menus
description: Use when working on role-based menus, page-level access, button permissions, or permission demos in this project.
---

# Permission And Menus

Use this skill for anything that affects left menu visibility, route access, or button-level permission behavior.

## Scope

- Permission routes:
  - `src/router/modules/permission.ts`
  - `src/router/modules/system.ts`
- Permission helpers:
  - `src/router/utils.ts`
- Permission store:
  - `src/store/modules/permission.ts`
- Button permission helpers:
  - `src/components/ReAuth`
  - `src/components/RePerms`
  - `src/directives/auth`
  - `src/directives/perms`
- Demo pages:
  - `src/views/permission/page/index.vue`
  - `src/views/permission/button/index.vue`
- Mock role/menu data:
  - `mock/login.ts`
  - `mock/system.ts`

## Current Permission Model

- Page-level access is driven by `meta.roles`.
- Button-level access is driven by `permissions` in login response.
- Menu visibility is derived from route tree plus current roles.
- Permission demo page can switch between `admin` and `common`.

## Important Couplings

- `mock/login.ts` controls returned `roles` and `permissions`
- `src/router/modules/*.ts` controls `meta.roles`
- `mock/system.ts` exposes role-to-menu mapping for role dialog and menu demo

If one changes without the others, the UI will feel inconsistent.

## Change Rules

- When adding a new protected page:
  - add route module meta roles
  - update mock role/menu coverage if the page should appear in menu structures
- When adding a new button permission:
  - update login mock permission list
  - use `Auth`, `v-auth`, or `hasAuth(...)`
- Keep `common` role lightweight. Do not silently expand it into full system management access.

## Validation

- Login as `admin`
- Login or switch to `common`
- Verify left menu changes immediately
- Verify button permission demo changes accordingly

