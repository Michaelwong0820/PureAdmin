---
name: system-management-pages
description: Use when working on the retained admin pages for user management, role management, and menu management in this project.
---

# System Management Pages

Use this skill for `用户管理`、`角色管理`、`菜单管理`.

## Scope

- Views:
  - `src/views/system/user/index.vue`
  - `src/views/system/role/index.vue`
  - `src/views/system/menu/index.vue`
- API layer:
  - `src/api/system.ts`
- Mock data:
  - `mock/system.ts`

## Current UI Pattern

- Element Plus only
- Search form on top
- One data table per page
- Mock-backed API calls through `src/api/system.ts`
- No heavy CRUD drawer/dialog system retained

## Page Responsibilities

### User Management

- Filters: username, phone, status
- Data source: `getUserList`
- Shows role list, status, create time

### Role Management

- Filters: name, code, status
- Data source: `getRoleList`
- Permission dialog uses:
  - `getRoleMenu`
  - `getRoleMenuIds`
- Tree is read-oriented in the current slimmed version

### Menu Management

- Filter: title
- Data source: `getMenuList`
- Displays tree table with path, role scope, type

## Change Rules

- Keep page structure lightweight; do not reintroduce old demo CRUD scaffolding unless explicitly required.
- If you add a field to a system page, update all of:
  - page view
  - `src/api/system.ts`
  - `mock/system.ts`
- Preserve the current route coverage:
  - `/system/user`
  - `/system/role`
  - `/system/menu`

## Validation

- Verify search and reset actions still work.
- Verify loading states wrap async calls.
- Run `vue-tsc --noEmit --skipLibCheck`

