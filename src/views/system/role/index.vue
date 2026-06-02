<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from "vue";
import { getRoleList, getRoleMenu, getRoleMenuIds } from "@/api/system";

defineOptions({
  name: "SystemRole"
});

const loading = ref(false);
const treeLoading = ref(false);
const tableData = ref([]);
const treeData = ref([]);
const checkedKeys = ref<number[]>([]);
const dialogVisible = ref(false);
const currentRole = ref("");
const treeRef = ref();

const form = reactive({
  name: "",
  code: "",
  status: ""
});

async function fetchRoles() {
  loading.value = true;
  try {
    const { data } = await getRoleList(form);
    tableData.value = data?.list ?? [];
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  form.name = "";
  form.code = "";
  form.status = "";
  fetchRoles();
}

async function openPermissionDialog(row: Record<string, any>) {
  currentRole.value = row.name;
  dialogVisible.value = true;
  treeLoading.value = true;
  try {
    const [{ data: menus }, { data: ids }] = await Promise.all([
      getRoleMenu({ roleId: row.id }),
      getRoleMenuIds({ roleId: row.id })
    ]);
    treeData.value = menus ?? [];
    checkedKeys.value = ids ?? [];
    await nextTick();
    treeRef.value?.setCheckedKeys(checkedKeys.value);
  } finally {
    treeLoading.value = false;
  }
}

onMounted(fetchRoles);
</script>

<template>
  <div class="space-y-4">
    <el-card shadow="never" class="rounded-3xl border-none">
      <el-form :inline="true" :model="form" class="flex flex-wrap gap-y-2">
        <el-form-item label="角色名称">
          <el-input
            v-model="form.name"
            clearable
            placeholder="请输入角色名称"
          />
        </el-form-item>
        <el-form-item label="角色标识">
          <el-input
            v-model="form.code"
            clearable
            placeholder="请输入角色标识"
          />
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
          <el-button type="primary" :loading="loading" @click="fetchRoles">
            搜索
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="rounded-3xl border-none">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-base font-semibold text-[#0f172a]">角色列表</span>
          <el-tag type="warning" effect="plain">
            点击“权限配置”查看角色菜单权限
          </el-tag>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" border>
        <el-table-column prop="name" label="角色名称" min-width="140" />
        <el-table-column prop="code" label="角色标识" min-width="140" />
        <el-table-column label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? "启用" : "停用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="说明" min-width="240" />
        <el-table-column label="操作" min-width="140" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="openPermissionDialog(row)">
              权限配置
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      width="560px"
      :title="`${currentRole} 的菜单权限`"
    >
      <div v-loading="treeLoading" class="rounded-2xl bg-[#f8fafc] p-4">
        <el-tree
          ref="treeRef"
          node-key="id"
          show-checkbox
          default-expand-all
          :data="treeData"
          :props="{ label: 'title', children: 'children' }"
        />
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>
