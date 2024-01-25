<template>
  <div ref="select" class="font-sans relative">
    <label :class="iSearch.labelColor" :for="id"
      >{{ label }}<span class="text-red-600"></span
    ></label>
    <div class="relative mt-1">
      <div
        @click="toggleOptions"
        :class="selectedClass"
        class="bg-white relative px-4 w-full border rounded py-2 focus:ring-transparent cursor-pointer"
      >
        <p
          :class="[iSearch.txtColor, iSearch.borderColor]"
          class="w-full line-clamp-1 text-base"
        >
          {{ valSelect.text }}
        </p>
        <Icon
          :name="!showOptions ? 'mdi:chevron-down' : 'mdi:chevron-up'"
          class="absolute top-1/2 -translate-y-1/2 right-2"
        />
      </div>
      <div
        v-if="showOptions"
        class="border-b border-x rounded-b"
        :class="[iSearch.dropdownPop, borderOpt]"
      >
        <div v-if="isSearchable" class="px-4">
          <input
            class="bg-white w-full border-b py-2 text-base focus:ring-transparent focus-visible:outline-none"
            :class="borderOpt"
            type="text"
            :placeholder="searchPlaceholder"
            v-model="searchQuery"
          />
        </div>
        <div class="option max-h-40 py-2 overflow-y-auto">
          <p
            v-for="op in listOption"
            :key="op.valOpt"
            class="px-4 py-1 uppercase cursor-pointer hover:bg-[#effafa]"
            @click="selectOption(op)"
            :class="optSelected(op)"
            v-if="listOption.length"
            :id="op.valOpt"
          >
            {{ op.text }}
          </p>
          <p v-else class="px-4">
            {{ searchNotFound }}
          </p>
        </div>
      </div>
    </div>
    <p v-if="error" class="text-base font-normal text-right" :class="errColor">
      {{ errorMsg }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  list: {
    type: Array as PropType<Array<{ text: string; valOpt: string }>>,
    default: [{ text: "Select Outlet", valOpt: "0" }],
  },
  searchPlaceholder: {
    default: "Cari..",
  },
  id: String,
  label: String,
  error: Boolean,
  errorMsg: String,
  errColor: { type: String, default: "text-red-600" },
  placeHolder: String,
  color: { type: String, default: "black" },
  colorLabel: { type: String, default: "black" },
  colorBorder: { type: String, default: "black" },
  mainColor: { type: String, default: "black" },
  dis: { type: Boolean, default: false },
  searchNotFound: { type: String, default: "Not found.." },
  isSearchable: { type: Boolean, default: true },
  modelValue: String,
});
const emit = defineEmits(["update:modelValue"]);
const select = ref();
const searchQuery = ref("");
const showOptions = ref(false);
const valSelect = ref({ text: "", valOpt: "" });
const $iSearch = useCssModule("iSearch");
// valSelect.value = props.list.find((item: any) => item.valOpt == "X") as {
//   text: string;
//   valOpt: string;
// };

// emit("update:modelValue", valSelect.value.valOpt);
const { width } = useWindowSize();

watch(
  () => props.modelValue,
  (newModel) => {
    if (newModel && props.list) {
      valSelect.value = props.list.find(({ valOpt }) => valOpt == newModel) as {
        text: string;
        valOpt: string;
      };
    }
  },
  { immediate: true, deep: true }
);

const listOption = computed(() => {
  if (searchQuery.value) {
    return props.list?.filter(({ text }) =>
      [text].some((val) =>
        val
          .toLowerCase()
          .includes(searchQuery.value ? searchQuery.value.toLowerCase() : "")
      )
    );
  }
  return props.list;
});

const toggleOptions = () => {
  searchQuery.value = "";
  showOptions.value = !showOptions.value;
};

const selectedClass = computed(() => {
  if (!showOptions.value) {
    return "";
  } else {
    return "border-dark-green";
  }
});

const borderOpt = computed(() => {
  return "border-dark-green";
});

const optSelected = computed(() => {
  return (opt: any) => {
    if (valSelect.value && opt.valOpt == valSelect.value.valOpt) {
      return $iSearch.txtMain;
    }
  };
});

const selectOption = (opt: any) => {
  valSelect.value = opt;
  emit("update:modelValue", valSelect.value.valOpt);
  toggleOptions();
};

onClickOutside(select, (e) => {
  //   console.log("test", e);
  searchQuery.value = "";
  showOptions.value = false;
});
</script>

<style module="iSearch">
.dropdownPop {
  position: absolute;
  background: white;
  width: 100%;
  z-index: 60;
}
.formGroup {
  position: relative;
}
.formLabel {
  position: absolute;
  left: 10px;
  top: 8px;
  color: #999;
  background-color: #fff;
  z-index: 10;
  transition: transform 150ms ease-out, font-size 150ms ease-out;
}
.focused .formLabel {
  transform: translateY(-125%);
  font-size: 0.75em;
  margin-top: 2px;
  padding: 0 4px;
}
.txtColor {
  color: v-bind(color);
}
.txtMain {
  color: v-bind(mainColor);
}
.labelColor {
  color: v-bind(colorLabel);
}
.borderColor:focus {
  border-color: v-bind(colorBorder);
}
.borderColor:focus-within {
  border-color: v-bind(colorBorder);
  outline: v-bind(colorBorder);
}
</style>
