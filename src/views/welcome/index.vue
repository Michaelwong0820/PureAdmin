<script setup lang="ts">
import { computed } from "vue";
import { useUserStoreHook } from "@/store/modules/user";

defineOptions({
  name: "Welcome"
});

const userStore = useUserStoreHook();

const cards = computed(() => [
  {
    title: "已保留模块",
    value: "5",
    description: "登录、首页、菜单、角色权限、用户管理"
  },
  {
    title: "当前角色",
    value: userStore.roles.join(" / "),
    description: "基于当前登录角色展示菜单和按钮权限"
  },
  {
    title: "项目目标",
    value: "更轻更稳",
    description: "去掉原模板中大量演示功能与重依赖"
  }
]);
</script>

<template>
  <div class="space-y-6">
    <section
      class="overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#0f172a,#1d4ed8_55%,#38bdf8)] px-6 py-8 text-white shadow-[0_28px_90px_-45px_rgba(29,78,216,0.9)] sm:px-8"
    >
      <p class="text-sm uppercase tracking-[0.3em] text-white/65">Dashboard</p>
      <h1 class="mt-4 text-3xl font-semibold sm:text-4xl">
        欢迎使用精简版后台
      </h1>
      <p class="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
        这一版聚焦基础管理场景，保留账号登录、首页导航、用户管理、角色权限和菜单管理，适合作为后续业务扩展的干净起点。
        <span class="i-carbon:logo-github inline-block" />
      </p>
    </section>

    <section class="grid gap-4 md:grid-cols-3">
      <el-card
        v-for="card in cards"
        :key="card.title"
        shadow="never"
        class="rounded-3xl border-none"
      >
        <p class="text-sm text-[#64748b]">{{ card.title }}</p>
        <p class="mt-4 text-3xl font-semibold text-[#0f172a]">
          {{ card.value }}
        </p>
        <p class="mt-3 text-sm leading-6 text-[#64748b]">
          {{ card.description }}
        </p>
      </el-card>
    </section>

    <section class="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <el-card shadow="never" class="rounded-3xl border-none">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-base font-semibold text-[#0f172a]">
              当前系统特点
            </span>
          </div>
        </template>
        <el-timeline>
          <el-timeline-item timestamp="路由" placement="top">
            改成静态路由 + 角色过滤菜单，保留基础权限控制。
          </el-timeline-item>
          <el-timeline-item timestamp="样式" placement="top">
            已从 Tailwind CSS 切换为 UnoCSS，保留原有原子化开发体验。
          </el-timeline-item>
          <el-timeline-item timestamp="页面" placement="top">
            去掉了演示型图表、复杂动效、富交互组件和大批示例页面。
          </el-timeline-item>
        </el-timeline>
      </el-card>

      <el-card shadow="never" class="rounded-3xl border-none">
        <template #header>
          <span class="text-base font-semibold text-[#0f172a]">
            建议的后续扩展
          </span>
        </template>
        <el-space direction="vertical" alignment="stretch" fill>
          <el-alert
            title="接入真实用户与角色接口"
            type="info"
            :closable="false"
          />
          <el-alert
            title="把菜单管理接成后端配置中心"
            type="success"
            :closable="false"
          />
          <el-alert
            title="按业务继续追加模块，而不是恢复模板全集"
            type="warning"
            :closable="false"
          />
        </el-space>
      </el-card>
    </section>
  </div>
</template>
