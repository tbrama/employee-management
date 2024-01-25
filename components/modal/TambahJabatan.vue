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
const { resAddJabatan, addJabatanAPI, resLsJabAll, lsJabAllAPI } = useAppApi();

const emit = defineEmits(["close-action", "simpan"]);
const close = () => {
  const modEl: HTMLDialogElement | null =
    document.querySelector("#addJabatanMod");
  if (modEl) modEl.close();
  v$.value.$reset();
  dataJabatan.namajab = "";
  dataJabatan.iddept = "X";
  // console.log(appStore.$state.detEmp);
  // emit("close-action");
};

const dataJabatan = reactive({
  nip: useAuthStore().$state.profile?.nip2 as string,
  namajab: "",
  iddept: "X",
});

const rules = computed(() => {
  return {
    namajab: {
      required: helpers.withMessage("Nama jabatan wajib di isi", required),
      maxLength: helpers.withMessage(
        "Nama jabatan maks. 75 karakter",
        maxLength(75)
      ),
      char: helpers.withMessage("Ilegal karakter", char),
    },
    iddept: {
      required: helpers.withMessage("Nama Departemen wajib di isi", required),
      not: helpers.withMessage("Departemen wajib di isi", not(sameAs("X"))),
    },
  };
});

const v$ = useVuelidate(rules, dataJabatan, { $lazy: true });

const simpanJabatan = async () => {
  v$.value.$validate();
  if (!v$.value.$error) {
    appStore.$state.detEmp.addby = useAuthStore().$state.profile
      ?.nip2 as string;
    appStore.$state.detEmp.lastupdateby = useAuthStore().$state.profile
      ?.nip2 as string;
    const modEl: HTMLDialogElement | null =
      document.querySelector("#addJabatanMod");
    if (modEl) modEl.close();
    emit("simpan");
    await addJabatanAPI(dataJabatan);
    await lsJabAllAPI();
    if (resLsJabAll.value) appStore.$state.lsJabAll = resLsJabAll.value;
    dataJabatan.namajab = "";
    dataJabatan.iddept = "X";
    v$.value.$reset();
    emit("simpan");
    if (modEl) modEl.showModal();
  }
};
</script>

<template>
  <dialog
    @keydown.esc="close"
    id="addJabatanMod"
    class="bg-transparent mr-0 min-w-[50%] max-w-[95%] my-0 h-[100dvh] max-h-[100dvh]"
  >
    <div class="flex flex-col h-full relative">
      <div
        class="p-2 font-bold bg-dark-green flex justify-between items-center"
      >
        <div>
          <p class="text-slate-50">Jabatan</p>
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
            List Jabatan
          </h1>
          <div class="flex flex-col overflow-auto">
            <template v-for="ld in appStore.$state.lsJabAll">
              <h2 class="font-medium">{{ ld.namadept }}:</h2>
              <p v-for="lj in ld.lsjab" class="flex gap-2 items-center">
                <Icon name="mdi:circle" class="text-xs text-green" />
                {{ lj.namajabatan }}
              </p>
            </template>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <InputText
            label="Nama Jabatan"
            v-model="dataJabatan.namajab"
            :error="v$.namajab.$error"
            :error-msg="v$.namajab.$errors.length ? v$.namajab.$errors[0].$message as string:''"
            @update:model-value="v$.namajab.$touch()"
          />
          <InputSelect
            v-if="appStore.$state.lsEmp"
            label="Departemen"
            :list="appStore.$state.lsEmp?.lsdept"
            v-model="dataJabatan.iddept"
            :error="v$.iddept.$error"
            :error-msg="v$.iddept.$errors.length ? v$.iddept.$errors[0].$message as string:''"
            @update:model-value="v$.iddept.$touch()"
          />
          <button
            @click="simpanJabatan"
            type="button"
            class="bg-dark-green rounded shadow p-2 text-slate-50 font-medium h-fit self-end col-span-2"
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
