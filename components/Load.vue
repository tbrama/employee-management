<template>
  <div>
    <div
      class="h-full flex flex-col flex-grow gap-2 items-center justify-center z-[999]"
    >
      <div class="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  backColor: { type: String, default: "bg-white" },
  width: { type: String, default: "80px" },
  height: { type: String, default: "80px" },
});

const showket = ref(false);
const tm = ref();
</script>

<style scoped>
/* .bg-load {
  background: radial-gradient(rgba(20, 20, 20, 0.8), rgba(0, 0, 0, 0.8));

  background: -webkit-radial-gradient(
    rgba(20, 20, 20, 0.8),
    rgba(0, 0, 0, 0.8)
  );
} */
.lds-ring {
  display: inline-block;
  position: relative;
  width: 20px;
  height: 20px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 20px;
  height: 20px;
  margin: 0px;
  border: 2px solid #285430;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #285430 transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
