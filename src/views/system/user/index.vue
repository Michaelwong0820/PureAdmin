<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { getUserList } from "@/api/system";

defineOptions({
  name: "SystemUser"
});

const loading = ref(false);
const tableData = ref([]);
const form = reactive({
  username: "",
  phone: "",
  status: ""
});

async function fetchUsers() {
  loading.value = true;
  try {
    const { data } = await getUserList(form);
    tableData.value = data?.list ?? [];
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  form.username = "";
  form.phone = "";
  form.status = "";
  fetchUsers();
}

onMounted(fetchUsers);
</script>

<template>
  <div class="space-y-4">
    <el-card shadow="never" class="rounded-3xl border-none">
      <el-form :inline="true" :model="form" class="flex flex-wrap gap-y-2">
        <el-form-item label="用户名称">
          <el-input
            v-model="form.username"
            clearable
            placeholder="请输入用户名称"
          />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" clearable placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="form.status"
            clearable
            placeholder="请选择状态"
            style="width: 160px"
          >
            <el-option label="启用" value="1" />
            <el-option label="停用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="fetchUsers">
            搜索
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="rounded-3xl border-none">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-base font-semibold text-[#0f172a]">用户列表</span>
          <el-tag type="info" effect="plain">基础演示数据</el-tag>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" border>
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column prop="phone" label="手机号" min-width="140" />
        <el-table-column prop="email" label="邮箱" min-width="220" />
        <el-table-column label="角色" min-width="140">
          <template #default="{ row }">
            {{ row.roles?.join(" / ") }}
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? "启用" : "停用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180" />
      </el-table>
    </el-card>
  </div>
</template>
