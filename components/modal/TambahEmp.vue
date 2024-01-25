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

const charName = helpers.regex(/^[a-zA-Z\s-.]*$/);
const char = helpers.regex(/^[a-zA-Z\s-.0-9]*$/);
const tel = helpers.regex(/^[0-9]+$/);

const appStore = useAppStore();
const {
  resListJabat,
  listJabatAPI,
  resAddEmp,
  addEmpAPI,
  resListEmp,
  listEmpAPI,
  resUpdateEmp,
  updateEmpAPI,
} = useAppApi();

const emit = defineEmits(["close-action", "simpan"]);
const close = () => {
  const modEl: HTMLDialogElement | null = document.querySelector("#addEmp");
  if (modEl) modEl.close();
  Object.keys(appStore.$state.detEmp).forEach((key) => {
    //@ts-ignore
    appStore.$state.detEmp[key] = "";
  });
  v$.value.$reset();
  appStore.$state.lsJabat = null;
  // console.log(appStore.$state.detEmp);
  // emit("close-action");
};

const rules = computed(() => {
  return {
    nmlengkap: {
      required: helpers.withMessage("Nama wajib di isi", required),
      maxLength: helpers.withMessage("Nama maks. 75 karakter", maxLength(75)),
      minLength: helpers.withMessage("Nama min. 4 karakter", minLength(4)),
      charName: helpers.withMessage("Ilegal karakter", charName),
    },
    tgllahir: {
      required: helpers.withMessage("Tanggal Lahir wajib di isi", required),
    },
    tmplahir: {
      required: helpers.withMessage("Tempat Lahir wajib di isi", required),
      charName: helpers.withMessage("Ilegal karakter", charName),
    },
    jnskelamin: {
      required: helpers.withMessage("Jenis kelamin wajib di isi", required),
      not: helpers.withMessage("Jenis kelamin wajib di isi", not(sameAs("X"))),
    },
    alamat: {
      required: helpers.withMessage("Alamat wajib di isi", required),
      char: helpers.withMessage("Ilegal karakter", char),
    },
    telepon: {
      required: helpers.withMessage("Telepon wajib di isi", required),
      tel: helpers.withMessage("Ilegal karakter", tel),
    },
    tglbekerja: {
      required: helpers.withMessage("Tanggal Lahir wajib di isi", required),
    },
    // tglakhirkontrak: "",
    namastatus: {
      required: helpers.withMessage("Status wajib di isi", required),
      not: helpers.withMessage("Status wajib di isi", not(sameAs("X"))),
    },
    namadept: {
      required: helpers.withMessage("Departemen wajib di isi", required),
      not: helpers.withMessage("Departemen wajib di isi", not(sameAs("X"))),
    },
    namajabatan: {
      required: helpers.withMessage("Jabatan wajib di isi", required),
      not: helpers.withMessage("Jabatan wajib di isi", not(sameAs("X"))),
    },
    email: {
      email: helpers.withMessage("Format email tidak sesuai", email),
    },
    agama: {
      charName: helpers.withMessage("Ilegal karakter", charName),
    },
    statusmenikah: {
      required: helpers.withMessage("Status menikah wajib di isi", required),
      charName: helpers.withMessage("Ilegal karakter", charName),
    },
  };
});

const modelVal = computed(() => {
  return appStore.$state.detEmp;
});

const v$ = useVuelidate(rules, modelVal, { $lazy: true });

const loadJabat = ref(false);
const getJabatan = async () => {
  if (appStore.$state.detEmp.namadept != "X") {
    loadJabat.value = true;
    await listJabatAPI(appStore.$state.detEmp.namadept);
    // console.log(resListJabat.value);
    if (resListJabat.value) appStore.$state.lsJabat = resListJabat.value;
    loadJabat.value = false;
  }
};

const simpanEmp = async () => {
  v$.value.$reset();
  v$.value.$validate();
  if (!v$.value.$error) {
    appStore.$state.detEmp.addby = useAuthStore().$state.profile
      ?.nip2 as string;
    appStore.$state.detEmp.lastupdateby = useAuthStore().$state.profile
      ?.nip2 as string;
    const modEl: HTMLDialogElement | null = document.querySelector("#addEmp");
    if (modEl) modEl.close();
    emit("simpan");
    if (!appStore.$state.isEdit) {
      await addEmpAPI(appStore.$state.detEmp);
    } else {
      // console.log(appStore.$state.detEmp);
      await updateEmpAPI(appStore.$state.detEmp);
    }
    await listEmpAPI();
    if (resListEmp.value) appStore.$state.lsEmp = resListEmp.value;
    emit("simpan");
    Object.keys(appStore.$state.detEmp).forEach((key) => {
      //@ts-ignore
      appStore.$state.detEmp[key] = "";
    });
    v$.value.$reset();
    appStore.$state.lsJabat = null;
  }
};
</script>

<template>
  <dialog
    @keydown.esc="close"
    id="addEmp"
    class="bg-transparent mr-0 min-w-[50%] max-w-[95%] my-0 h-[100dvh] max-h-[100dvh]"
  >
    <div class="flex flex-col h-full relative">
      <div
        class="p-2 font-bold bg-dark-green flex justify-between items-center"
      >
        <div>
          <p class="text-slate-50">
            {{ !appStore.$state.isEdit ? "Tambah Pegawai" : "Edit Pegawai" }}
          </p>
        </div>
        <button @click="close">
          <Icon name="mdi:close-circle" class="text-slate-50 text-xl" />
        </button>
      </div>
      <div
        class="flex-grow bg-slate-50 p-3 flex flex-col justify-between gap-3 overflow-y-auto"
      >
        <div class="grid grid-cols-2 gap-2">
          <InputText
            label="Nama Lengkap"
            v-model="appStore.$state.detEmp.nmlengkap"
            :error="v$.nmlengkap.$error"
            :error-msg="v$.nmlengkap.$errors.length ? v$.nmlengkap.$errors[0].$message as string:''"
            @update:model-value="v$.nmlengkap.$touch()"
          />
          <InputDate
            label="Tanggal Lahir"
            v-model="appStore.$state.detEmp.tgllahir"
            :error="v$.tgllahir.$error"
            :error-msg="v$.tgllahir.$errors.length ? v$.tgllahir.$errors[0].$message as string:''"
            @update:model-value="v$.tgllahir.$touch()"
          />
          <InputText
            label="Tempat Lahir"
            v-model="appStore.$state.detEmp.tmplahir"
            :error="v$.tmplahir.$error"
            :error-msg="v$.tmplahir.$errors.length ? v$.tmplahir.$errors[0].$message as string:''"
            @update:model-value="v$.tmplahir.$touch()"
          />
          <InputSelect
            label="Jenis Kelamin"
            :list="appStore.$state.lsEmp?.lsjnskelamin"
            v-model="appStore.$state.detEmp.jnskelamin"
            :error="v$.jnskelamin.$error"
            :error-msg="v$.jnskelamin.$errors.length ? v$.jnskelamin.$errors[0].$message as string:''"
            @update:model-value="v$.jnskelamin.$touch()"
          />
          <InputText
            label="Alamat"
            v-model="appStore.$state.detEmp.alamat"
            :error="v$.alamat.$error"
            :error-msg="v$.alamat.$errors.length ? v$.alamat.$errors[0].$message as string:''"
            @update:model-value="v$.alamat.$touch()"
          />
          <InputText
            label="Telepon"
            v-model="appStore.$state.detEmp.telepon"
            :error="v$.telepon.$error"
            :error-msg="v$.telepon.$errors.length ? v$.telepon.$errors[0].$message as string:''"
            @update:model-value="v$.telepon.$touch()"
          />
          <InputSelect
            label="Status"
            :list="appStore.$state.lsEmp?.lsstatus"
            v-model="appStore.$state.detEmp.namastatus"
            :error="v$.namastatus.$error"
            :error-msg="v$.namastatus.$errors.length ? v$.namastatus.$errors[0].$message as string:''"
            @update:model-value="v$.namastatus.$touch()"
          />
          <InputDate
            label="Tanggal Bekerja"
            v-model="appStore.$state.detEmp.tglbekerja"
            :error="v$.tglbekerja.$error"
            :error-msg="v$.tglbekerja.$errors.length ? v$.tglbekerja.$errors[0].$message as string:''"
            @update:model-value="v$.tglbekerja.$touch()"
          />
          <InputDate
            v-if="
              appStore.$state.detEmp.namastatus != 'X' &&
              appStore.$state.detEmp.namastatus != 'ST24010000001'
            "
            label="Tanggal Akhir Kontrak"
            v-model="(appStore.$state.detEmp.tglakhirkontrak as string)"
          />
          <InputSelect
            label="Departemen"
            :list="appStore.$state.lsEmp?.lsdept"
            v-model="appStore.$state.detEmp.namadept"
            :error="v$.namadept.$error"
            :error-msg="v$.namadept.$errors.length ? v$.namadept.$errors[0].$message as string:''"
            @update:model-value="
              {
                v$.namadept.$touch();
                getJabatan();
              }
            "
          />
          <InputText
            v-if="appStore.$state.detEmp.namadept == 'X' && !loadJabat"
            label="Jabatan"
            placeholder="Pilih departemen terlebih dulu"
            :disable="true"
          />
          <div v-if="loadJabat">
            <p>Jabatan</p>
            <Load />
          </div>
          <InputSelect
            v-if="
              appStore.$state.detEmp.namadept != 'X' &&
              !loadJabat &&
              appStore.$state.lsJabat
            "
            label="Jabatan"
            :list="appStore.$state.lsJabat"
            v-model="appStore.$state.detEmp.namajabatan"
            :error="v$.namajabatan.$error"
            :error-msg="v$.namajabatan.$errors.length ? v$.namajabatan.$errors[0].$message as string:''"
            @update:model-value="v$.namajabatan.$touch()"
          />
          <InputText
            label="Email"
            v-model="appStore.$state.detEmp.email"
            :error="v$.email.$error"
            :error-msg="v$.email.$errors.length ? v$.email.$errors[0].$message as string:''"
            @update:model-value="v$.email.$touch()"
          />
          <InputText
            label="Agama"
            v-model="appStore.$state.detEmp.agama"
            :error="v$.agama.$error"
            :error-msg="v$.agama.$errors.length ? v$.agama.$errors[0].$message as string:''"
            @update:model-value="v$.agama.$touch()"
          />
          <InputText
            label="Status Menikah"
            v-model="appStore.$state.detEmp.statusmenikah"
            :error="v$.statusmenikah.$error"
            :error-msg="v$.statusmenikah.$errors.length ? v$.statusmenikah.$errors[0].$message as string:''"
            @update:model-value="v$.statusmenikah.$touch()"
          />
        </div>
        <button
          @click="simpanEmp"
          type="button"
          class="bg-dark-green rounded shadow p-2 text-slate-50 font-medium"
        >
          Simpan
        </button>
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
