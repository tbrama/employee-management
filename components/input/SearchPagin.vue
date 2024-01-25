<script setup lang="ts">
const props = defineProps({
  id: String,
  label: String,
  modelValue: { type: Number },
});
const emit = defineEmits(["update:modelValue", "hide-pagin"]);
const { width } = useWindowSize();
const srchI = ref();
const valInput = ref(props.modelValue);
onClickOutside(srchI, () => emit("hide-pagin"));

// watchDebounced(
//   valInput,
//   () => {
//     // console.log("changed!", valInput.value);
//     if (valInput.value == 0) {
//       valInput.value = 1;
//     }
//     emit("update:modelValue", valInput.value);
//   },
//   { debounce: 500, maxWait: 3000 }
// );

const enterKey = () => {
  if (valInput.value == 0) {
    valInput.value = 1;
  }
  emit("update:modelValue", valInput.value);
  emit("hide-pagin");
};

// {
//   emit("get-enter", e.target.value);
// };
</script>

<template>
  <div ref="srchI" class="relative">
    <input
      type="number"
      class="pr-4 bg-white placeholder:text-sm focus:ring-2 focus:ring-transparent focus-visible:outline-none w-[40px]"
      autocomplete="off"
      v-model="valInput"
      @keyup.enter="enterKey"
    />
    <span @click="enterKey" class="absolute right-0 top-1/2 -translate-y-1/2"
      ><Icon name="mdi:magnify" class="self-center" />
    </span>
  </div>
</template>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
  text-align: center;
  position: relative;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
  text-align: center;
  position: relative;
  margin: 0;
}
</style>
