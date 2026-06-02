<script setup lang="ts">
import { hasAuth, getAuths } from "@/router/utils";

defineOptions({
  name: "PermissionButton"
});
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm text-[#64748b]">
      当前按钮权限码：{{ getAuths().join(" / ") }}
    </p>

    <el-card shadow="never" class="rounded-3xl border-none">
      <template #header>
        <div class="text-base font-semibold text-[#0f172a]">
          组件方式判断权限
        </div>
      </template>
      <el-space wrap>
        <Auth value="permission:btn:add">
          <el-button plain type="warning">
            拥有 code：permission:btn:add 可见
          </el-button>
        </Auth>
        <Auth :value="['permission:btn:edit']">
          <el-button plain type="primary">
            拥有 code：permission:btn:edit 可见
          </el-button>
        </Auth>
        <Auth
          :value="[
            'permission:btn:add',
            'permission:btn:edit',
            'permission:btn:delete'
          ]"
        >
          <el-button plain type="danger">
            拥有全部增删改权限时可见
          </el-button>
        </Auth>
      </el-space>
    </el-card>

    <el-card shadow="never" class="rounded-3xl border-none">
      <template #header>
        <div class="text-base font-semibold text-[#0f172a]">
          函数方式判断权限
        </div>
      </template>
      <el-space wrap>
        <el-button v-if="hasAuth('permission:btn:add')" plain type="warning">
          add 按钮可见
        </el-button>
        <el-button v-if="hasAuth(['permission:btn:edit'])" plain type="primary">
          edit 按钮可见
        </el-button>
        <el-button
          v-if="
            hasAuth([
              'permission:btn:add',
              'permission:btn:edit',
              'permission:btn:delete'
            ])
          "
          plain
          type="danger"
        >
          delete 按钮可见
        </el-button>
      </el-space>
    </el-card>

    <el-card shadow="never" class="rounded-3xl border-none">
      <template #header>
        <div class="text-base font-semibold text-[#0f172a]">
          指令方式判断权限
        </div>
      </template>
      <el-space wrap>
        <el-button v-auth="'permission:btn:add'" plain type="warning">
          v-auth add
        </el-button>
        <el-button v-auth="['permission:btn:edit']" plain type="primary">
          v-auth edit
        </el-button>
        <el-button
          v-auth="[
            'permission:btn:add',
            'permission:btn:edit',
            'permission:btn:delete'
          ]"
          plain
          type="danger"
        >
          v-auth delete
        </el-button>
      </el-space>
    </el-card>
  </div>
</template>
