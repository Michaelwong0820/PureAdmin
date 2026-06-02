<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import { setToken } from "@/utils/auth";
import { useUserStoreHook } from "@/store/modules/user";
import { initRouter } from "@/router/utils";
import { usePermissionStoreHook } from "@/store/modules/permission";

defineOptions({
  name: "PermissionPage"
});

const router = useRouter();
const userStore = useUserStoreHook();
const permissionStore = usePermissionStoreHook();
const username = ref(userStore.username || "admin");

const menuPreview = computed(() => permissionStore.wholeMenus);

async function onChange() {
  try {
    const { data } = await userStore.loginByUsername({
      username: username.value,
      password: "admin123"
    });
    setToken(data);
    userStore.setUserInfo(data);
    await initRouter("/permission/page");
    message("角色切换成功", { type: "success" });
    await router.push("/permission/page");
  } catch {
    message("角色切换失败", { type: "error" });
  }
}
</script>

<template>
  <div class="space-y-4">
    <el-card shadow="never" class="rounded-3xl border-none">
      <template #header>
        <span class="text-base font-semibold text-[#0f172a]">
          页面权限演示
        </span>
      </template>
      <p class="mb-4 text-sm leading-6 text-[#64748b]">
        切换角色后，左侧菜单会立即按角色范围过滤。`admin`
        可查看系统管理，`common` 仅保留首页与权限演示。
      </p>
      <el-select v-model="username" style="width: 220px" @change="onChange">
        <el-option label="管理员角色（admin）" value="admin" />
        <el-option label="普通角色（common）" value="common" />
      </el-select>
    </el-card>

    <el-card shadow="never" class="rounded-3xl border-none">
      <template #header>
        <span class="text-base font-semibold text-[#0f172a]">
          当前可见菜单
        </span>
      </template>
      <el-space wrap>
        <el-tag
          v-for="item in menuPreview"
          :key="item.path"
          type="primary"
          effect="plain"
        >
          {{ item.meta?.title }}
        </el-tag>
      </el-space>
    </el-card>
  </div>
</template>
