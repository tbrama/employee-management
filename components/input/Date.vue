<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import dayjs from "dayjs";
import idr from "dayjs/locale/id";
const props = defineProps({
  id: String,
  label: String,
  modelValue: String,
  placeholder: String,
  error: Boolean,
  errorMsg: String,
  errColor: { type: String, default: "text-red-600" },
  maxRange: { type: Number, default: 32 },
});

const emit = defineEmits(["update:modelValue"]);

const { width } = useWindowSize();

const date = ref<string>();

if (props.modelValue?.length) {
  date.value = props.modelValue;
}

watch(
  () => props.modelValue,
  (newModel) => {
    // if (newModel?.length) {
    date.value = newModel;
    // }
  }
);

const format = (date: any) => {
  return dayjs(date).locale(idr).format("DD MMM YYYY");
};

const colorBase = computed(() => {
  if (width.value > 890) return "#008b97";
  else return "#cc1a0b";
});

const colorBaseLight = computed(() => {
  if (width.value > 890) return "#d2fbff";
  else return "#fccbc6";
});
</script>

<template>
  <div class="font-Poppins relative">
    <VueDatePicker
      :id="id"
      v-model="date"
      :enable-time-picker="false"
      :placeholder="placeholder"
      @update:modelValue="
        emit('update:modelValue', dayjs(date).format('YYYY-MM-DD'))
      "
      :format="format"
      :clearable="false"
      ><template #dp-input="{ value, onInput, onEnter, onTab, onClear }">
        <label class="font-sans" :for="id">{{ label }}</label>
        <div class="relative mt-1">
          <input
            :id="id"
            class="rounded font-sans px-4 w-full border py-2 outline-none transition-colors duration-200 ease-in-out placeholder:text-black focus:ring-2 focus:ring-transparent focus:border-dark-green"
            autocomplete="off"
            :placeholder="placeholder ? placeholder : ''"
            type="text"
            :value="value"
          />
          <Icon
            name="mdi:calendar-blank-outline"
            class="absolute top-1/2 -translate-y-1/2 right-2"
          />
        </div>
      </template>
    </VueDatePicker>
    <p
      v-show="error"
      class="text-xs font-normal text-right absolute right-0"
      :class="errColor"
    >
      {{ errorMsg }}
    </p>
  </div>
</template>

<style scoped></style>
