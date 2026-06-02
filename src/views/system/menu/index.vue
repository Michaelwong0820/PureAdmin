<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { getMenuList } from "@/api/system";

defineOptions({
  name: "SystemMenu"
});

const loading = ref(false);
const tableData = ref([]);
const form = reactive({
  title: ""
});

async function fetchMenus() {
  loading.value = true;
  try {
    const { data } = await getMenuList(form);
    tableData.value = data ?? [];
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  form.title = "";
  fetchMenus();
}

onMounted(fetchMenus);
</script>

<template>
  <div class="space-y-4">
    <el-card shadow="never" class="rounded-3xl border-none">
      <el-form :inline="true" :model="form">
        <el-form-item label="菜单名称">
          <el-input
            v-model="form.title"
            clearable
            placeholder="请输入菜单名称"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="fetchMenus">
            搜索
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="rounded-3xl border-none">
      <template #header>
        <span class="text-base font-semibold text-[#0f172a]">菜单结构</span>
      </template>

      <el-table
        :data="tableData"
        v-loading="loading"
        row-key="id"
        border
        default-expand-all
        :tree-props="{ children: 'children' }"
      >
        <el-table-column prop="title" label="菜单名称" min-width="220" />
        <el-table-column prop="path" label="路径" min-width="220" />
        <el-table-column prop="rolesText" label="角色范围" min-width="160" />
        <el-table-column prop="typeText" label="类型" min-width="120" />
      </el-table>
    </el-card>
  </div>
</template>
