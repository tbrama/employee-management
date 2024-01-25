<script setup lang="ts">
const props = defineProps({
  id: String,
  label: String,
  placeholder: { type: String, default: "" },
  modelValue: { type: String, default: "" },
});
const emit = defineEmits(["update:modelValue", "get-enter", "hide-search"]);
const { width } = useWindowSize();
const srchI = ref();
const valInput = ref(props.modelValue);
// onClickOutside(srchI, () => emit("hide-search"));

// watchDebounced(
//   valInput,
//   () => {
//     // console.log("changed!", valInput.value);
//     emit("update:modelValue", valInput.value);
//   },
//   { debounce: 500, maxWait: 3000 }
// );

watch(
  () => props.modelValue,
  (newVal) => {
    valInput.value = newVal;
  }
);

const enterKey = (e: any) => {
  emit("get-enter", valInput.value);
  emit("hide-search");
};

const updateValue = (e: Event) => {
  emit("update:modelValue", valInput.value);
};

// {
//   emit("get-enter", e.target.value);
// };
</script>

<template>
  <div class="relative">
    <label class="font-sans" :for="id">{{ label }}</label>
    <div class="relative">
      <input
        ref="srchI"
        type="text"
        :placeholder="placeholder"
        class="rounded px-4 w-full border py-2 outline-none transition-colors duration-200 ease-in-out placeholder:text-gray-500 placeholder focus:ring-2 focus:ring-transparent focus:border-dark-green"
        autocomplete="off"
        v-model="valInput"
        @keyup="updateValue"
        @keyup.enter="enterKey"
      />
      <!-- <span
        v-if="valInput"
        @click="valInput = ''"
        class="absolute right-3 top-1/2 -translate-y-1/2"
        ><Icon name="mdi:close" class="self-center cursor-pointer" />
      </span> -->
      <span
        @click="enterKey"
        class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-lg"
        ><Icon name="mdi:magnify" class="self-center cursor-pointer" />
      </span>
    </div>
  </div>
</template>

<style scoped></style>
