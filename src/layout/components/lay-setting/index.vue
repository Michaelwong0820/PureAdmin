<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import LayPanel from "../lay-panel/index.vue";
import { useGlobal } from "@pureadmin/utils";

const { t } = useI18n();
const { $storage } = useGlobal<GlobalPropertiesApi>();

const layoutLabel = computed(() => $storage?.layout?.layout ?? "vertical");
const themeLabel = computed(() => $storage?.layout?.themeMode ?? "light");
</script>

<template>
  <LayPanel>
    <div class="p-4 text-sm leading-6 text-[var(--el-text-color-regular)]">
      <p class="mb-3 text-sm font-medium text-[var(--el-text-color-primary)]">
        {{ t("panel.pureSystemSet") }}
      </p>
      <p>
        当前项目保留了原框架布局、导航和主题能力，演示型系统设置项已经随精简一起移除。
      </p>
      <div class="mt-4 rounded-md bg-[var(--el-fill-color-light)] p-3">
        <p>{{ t("panel.pureMenuLayout") }}: {{ layoutLabel }}</p>
        <p class="mt-2">{{ t("panel.pureThemeMode") }}: {{ themeLabel }}</p>
      </div>
    </div>
  </LayPanel>
</template>
