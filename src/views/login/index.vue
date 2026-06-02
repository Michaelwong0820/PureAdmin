<script setup lang="ts">
import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import type { FormInstance, FormRules } from "element-plus";
import { message } from "@/utils/message";
import { setToken } from "@/utils/auth";
import { useUserStoreHook } from "@/store/modules/user";
import { getDefaultRoutePath, initRouter } from "@/router/utils";

import Bg from "@/assets/login/bg.png";
import Avatar from "@/assets/login/avatar.svg?component";
import Illustration from "@/assets/login/illustration.svg?component";

defineOptions({
  name: "Login"
});

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const loading = ref(false);
const formRef = ref<FormInstance>();
const userStore = useUserStoreHook();

const form = reactive({
  username: "admin",
  password: "admin123"
});

const rules: FormRules = {
  username: [
    { required: true, message: t("login.pureUsernameReg"), trigger: "blur" }
  ],
  password: [
    { required: true, message: t("login.purePassWordReg"), trigger: "blur" }
  ]
};

async function handleLogin() {
  if (!formRef.value) return;
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;

  loading.value = true;
  userStore
    .loginByUsername(form)
    .then(async ({ data }) => {
      setToken(data);
      userStore.setUserInfo(data);
      const redirect =
        typeof route.query.redirect === "string"
          ? route.query.redirect
          : getDefaultRoutePath();
      await initRouter(redirect);
      await router.push(redirect);
      message(t("login.pureLoginSuccess"), { type: "success" });
    })
    .catch(() => {
      message(t("login.pureLoginFail"), { type: "error" });
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>

<template>
  <div class="select-none">
    <img :src="Bg" class="wave" />
    <div class="login-container">
      <div class="img">
        <Illustration />
      </div>
      <div class="login-box">
        <div class="login-form">
          <Avatar class="avatar" />
          <h2>Pure Admin</h2>
          <p class="mb-5 text-sm leading-6 text-[#606266]">
            默认账号：`admin / admin123`、`common / admin123`
          </p>
          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            size="large"
            @submit.prevent="handleLogin"
          >
            <el-form-item prop="username">
              <el-input
                v-model="form.username"
                clearable
                :placeholder="t('login.pureUsername')"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="form.password"
                clearable
                show-password
                type="password"
                :placeholder="t('login.purePassword')"
                @keyup.enter="handleLogin"
              />
            </el-form-item>
            <el-button
              class="mt-4 w-full"
              type="primary"
              :loading="loading"
              @click="handleLogin"
            >
              {{ t("login.pureLogin") }}
            </el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("@/style/login.css");
</style>
