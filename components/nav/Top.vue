<script lang="ts" setup>
const authStore = useAuthStore();
</script>

<template>
  <div
    class="sticky top-0 w-full p-2 flex items-center justify-between bg-dark-green"
  >
    <h1 class="text-slate-50 font-bold text-xl">Employee Management</h1>
    <button
      type="button"
      class="p-2 rounded bg-green flex items-center gap-1 text-slate-50 font-medium"
    >
      {{ authStore.$state.profile?.nmlengkap }}
      <Icon name="mdi:chevron-down" />
    </button>
  </div>
</template>

<style scoped></style>
