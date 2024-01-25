<script lang="ts" setup>
import dayjs from "dayjs";
import idr from "dayjs/locale/id";
import {
  required,
  not,
  helpers,
  sameAs,
  maxLength,
  minLength,
  email,
} from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useAppStore } from "~/stores/App";
import type { ListEmp } from "~/utils/interface/LsEmployee";

const char = helpers.regex(/^[a-zA-Z\s-.0-9]*$/);

const appStore = useAppStore();
const { resAddDept, addDeptAPI, resLsDept, lsDeptAPI } = useAppApi();

const emit = defineEmits(["close-action", "simpan"]);
const close = () => {
  const modEl: HTMLDialogElement | null = document.querySelector("#addDeptMod");
  if (modEl) modEl.close();
  v$.value.$reset();
  // console.log(appStore.$state.detEmp);
  // emit("close-action");
};

const dataDept = reactive({
  nip: useAuthStore().$state.profile?.nip2 as string,
  namadept: "",
});

const rules = computed(() => {
  return {
    namadept: {
      required: helpers.withMessage("Nama departement wajib di isi", required),
      maxLength: helpers.withMessage(
        "Nama departement maks. 75 karakter",
        maxLength(75)
      ),
      char: helpers.withMessage("Ilegal karakter", char),
    },
  };
});

const v$ = useVuelidate(rules, dataDept, { $lazy: true });

const simpanDept = async () => {
  v$.value.$reset();
  v$.value.$validate();
  if (!v$.value.$error) {
    appStore.$state.detEmp.addby = useAuthStore().$state.profile
      ?.nip2 as string;
    appStore.$state.detEmp.lastupdateby = useAuthStore().$state.profile
      ?.nip2 as string;
    const modEl: HTMLDialogElement | null =
      document.querySelector("#addDeptMod");
    if (modEl) modEl.close();
    emit("simpan");
    await addDeptAPI(dataDept);
    await lsDeptAPI();
    if (resLsDept.value)
      (appStore.$state.lsEmp as ListEmp).lsdept = resLsDept.value;
    dataDept.namadept = "";
    emit("simpan");
  }
};
</script>

<template>
  <dialog
    @keydown.esc="close"
    id="addDeptMod"
    class="bg-transparent mr-0 min-w-[50%] max-w-[95%] my-0 h-[100dvh] max-h-[100dvh]"
  >
    <div class="flex flex-col h-full relative">
      <div
        class="p-2 font-bold bg-dark-green flex justify-between items-center"
      >
        <div>
          <p class="text-slate-50">Departemen</p>
        </div>
        <button @click="close">
          <Icon name="mdi:close-circle" class="text-slate-50 text-xl" />
        </button>
      </div>
      <div
        class="flex-grow bg-slate-50 p-3 flex flex-col justify-between gap-3 overflow-y-auto"
      >
        <div class="flex-grow flex-col gap-2 overflow-auto">
          <h1 class="font-medium text-lg sticky top-0 bg-slate-50">
            List Departemen
          </h1>
          <div class="flex flex-col overflow-auto">
            <p
              v-for="ld in appStore.$state.lsEmp?.lsdept.filter(
                ({ valOpt }) => valOpt != 'X'
              )"
              class="flex gap-2 items-center"
            >
              <Icon name="mdi:circle" class="text-xs text-green" />
              {{ ld.text }}
            </p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <InputText
            label="Nama Dept"
            v-model="dataDept.namadept"
            :error="v$.namadept.$error"
            :error-msg="v$.namadept.$errors.length ? v$.namadept.$errors[0].$message as string:''"
            @update:model-value="v$.namadept.$touch()"
          /><button
            @click="simpanDept"
            type="button"
            class="bg-dark-green rounded shadow p-2 text-slate-50 font-medium h-fit self-end"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
::backdrop {
  background: black;
  opacity: 0.75;
}
dialog[open] {
  -webkit-animation: show 1s ease normal;
  animation: show 1s ease normal;
}

@keyframes show {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0%);
  }
}
@-webkit-keyframes show {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0%);
  }
}
</style>
