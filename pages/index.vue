<script lang="ts" setup>
import { useAuthApi } from "~/composables/AuthApi";
import { required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

const { resLogin, loginAPI } = useAuthApi();
const isLoading = ref(false);
const authStore = useAuthStore();
const dataLogin = reactive({ nip: "", pass: "" });

const rules = computed(() => {
  return {
    nip: {
      required: helpers.withMessage("NIP wajib di isi", required),
    },
    pass: {
      required: helpers.withMessage("Password wajib di isi", required),
    },
  };
});

const v$ = useVuelidate(rules, dataLogin);
const login = async () => {
  v$.value.$validate();
  if (!v$.value.$error) {
    isLoading.value = true;
    await loginAPI(dataLogin);
    if (resLogin.value && !resLogin.value.msg) {
      authStore.setProfile(resLogin.value.data);
      authStore.setToken(resLogin.value.token);
      useRouter().replace("/dashboard");
    }
    if (resLogin.value && resLogin.value.msg) {
      const modEl: null | HTMLDialogElement =
        document.querySelector("#modAlertLogin");
      if (modEl) modEl.showModal();
    }
    isLoading.value = false;
  }
};

onMounted(() => {
  if (authStore.$state.token) {
    useRouter().replace("/dashboard");
  }
});
</script>

<template>
  <div
    class="h-[100dvh] grid grid-cols-2 bg-lightl justify-center items-center p-4 gap-4"
  >
    <div class="shadow rounded p-4 bg-slate-50">
      <h1 class="text-center text-xl font-bold">Employee Management</h1>
      <form @submit.prevent class="flex flex-col gap-2" autocomplete="on">
        <InputText
          label="NIP"
          :error="v$.nip.$error"
          :error-msg="v$.nip.$errors.length ? v$.nip.$errors[0].$message as string :''"
          v-model="dataLogin.nip"
        />
        <InputPassword
          label="Password"
          :error="v$.pass.$error"
          :error-msg="v$.pass.$errors.length ? v$.pass.$errors[0].$message as string :''"
          v-model="dataLogin.pass"
        />
        <button
          @click="login"
          type="submit"
          class="bg-dark-green rounded p-2 font-bold text-slate-50"
        >
          Login
        </button>
      </form>
    </div>
    <div class="self-center p-4">
      <!-- <img
        class="h-[80px] object-contain mx-auto"
        src="~/assets/img/logo_kazee_2.svg"
        alt="logo kazee"
      /> -->
    </div>
    <Loading :is-loading="isLoading" />
    <ModalBaseCenter id="modAlertLogin" title="Peringatan!">
      <p>{{ resLogin?.msg }}</p>
    </ModalBaseCenter>
  </div>
</template>

<style scoped></style>
