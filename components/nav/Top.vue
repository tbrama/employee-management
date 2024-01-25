<script lang="ts" setup>
const authStore = useAuthStore();
const { logoutAPI } = useAuthApi();

const emit = defineEmits(["logout"]);
const showList = () => {
  const el: HTMLElement | null = document.getElementById("listUser");
  if (el) {
    if (el.classList.contains("hidden")) {
      el.classList.remove("hidden");
      return;
    }
    el.classList.add("hidden");
  }
};

const logout = async () => {
  emit("logout");
  await logoutAPI();
  authStore.resetProfile();
  authStore.resetToken();
  useRouter().replace("/");
  emit("logout");
};
</script>

<template>
  <div
    class="sticky top-0 w-full p-2 flex items-center justify-between bg-dark-green z-50"
  >
    <h1 class="text-slate-50 font-bold text-xl">Employee Management</h1>
    <div class="relative z-50">
      <button
        @click="showList"
        type="button"
        class="p-2 rounded bg-green flex items-center gap-1 text-slate-50 font-medium"
      >
        {{ authStore.$state.profile?.nmlengkap }}
        <Icon name="mdi:chevron-down" />
      </button>
      <div
        id="listUser"
        class="absolute right-0 hidden bg-slate-50 shadow rounded p-2 z-50 mt-1"
      >
        <button
          @click="logout"
          type="button"
          class="hover:border-b hover:border-dark-green"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
