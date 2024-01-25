<script lang="ts" setup>
import type { LsEmployee } from "~/utils/interface/LsEmployee";
import dayjs from "dayjs";
import idr from "dayjs/locale/id";
import { useAppStore } from "~/stores/App";

const {
  resListEmp,
  listEmpAPI,
  resListJabat,
  listJabatAPI,
  resDeleteEmp,
  deleteEmpAPI,
} = useAppApi();
const isLoading = ref(false);
const appStore = useAppStore();

const btnAdd = ref();
const showAddOption = () => {
  const el: null | HTMLElement = document.getElementById("listAdd");
  if (el) {
    if (el.classList.contains("hidden")) {
      el.classList.remove("hidden");
      return;
    }
    el.classList.add("hidden");
  }
};

onClickOutside(btnAdd, () => {
  const el: null | HTMLElement = document.getElementById("listAdd");
  if (el) {
    if (!el.classList.contains("hidden")) {
      el.classList.add("hidden");
    }
  }
});

const showAddEmp = () => {
  const modEl: HTMLDialogElement | null = document.querySelector("#addEmp");
  if (modEl) modEl.showModal();
  const el: null | HTMLElement = document.getElementById("listAdd");
  if (el) {
    if (!el.classList.contains("hidden")) {
      el.classList.add("hidden");
    }
  }
  appStore.$state.isEdit = false;
  Object.keys(appStore.$state.detEmp).forEach((key) => {
    if (
      Array("namadept", "namastatus", "namajabatan", "jnskelamin").includes(key)
    ) {
      //@ts-ignore
      appStore.$state.detEmp[key] = "X";
    }
  });
};

const showAddDept = () => {
  const modEl: HTMLDialogElement | null = document.querySelector("#addDeptMod");
  if (modEl) modEl.showModal();
  const el: null | HTMLElement = document.getElementById("listAdd");
  if (el) {
    if (!el.classList.contains("hidden")) {
      el.classList.add("hidden");
    }
  }
};

const showAddStatus = () => {
  const modEl: HTMLDialogElement | null =
    document.querySelector("#addStatusMod");
  if (modEl) modEl.showModal();
  const el: null | HTMLElement = document.getElementById("listAdd");
  if (el) {
    if (!el.classList.contains("hidden")) {
      el.classList.add("hidden");
    }
  }
};

const editEmp = async (det: LsEmployee) => {
  appStore.$state.detEmp = JSON.parse(JSON.stringify(det));
  appStore.$state.detEmp.namadept = appStore.$state.lsEmp?.lsdept.find(
    ({ text }) => text == det.namadept
  )?.valOpt as string;
  appStore.$state.detEmp.namastatus = appStore.$state.lsEmp?.lsstatus.find(
    ({ text }) => text == det.namastatus
  )?.valOpt as string;
  appStore.$state.detEmp.jnskelamin = appStore.$state.lsEmp?.lsjnskelamin.find(
    ({ text }) => text == det.jnskelamin
  )?.valOpt as string;
  isLoading.value = true;
  await listJabatAPI(appStore.$state.detEmp.namadept);
  if (resListJabat.value) appStore.$state.lsJabat = resListJabat.value;
  appStore.$state.detEmp.namajabatan = appStore.$state.lsJabat?.find(
    ({ text }) => text == det.namajabatan
  )?.valOpt as string;

  isLoading.value = false;
  appStore.$state.isEdit = true;
  const modEl: HTMLDialogElement | null = document.querySelector("#addEmp");
  if (modEl) modEl.showModal();
  const el: null | HTMLElement = document.getElementById("listAdd");
  if (el) {
    if (!el.classList.contains("hidden")) {
      el.classList.add("hidden");
    }
  }
};

const dataDelete = reactive({
  nip: "",
  nama: "",
  updateby: useAuthStore().$state.profile?.nip2 as string,
});
const showAlertDelete = (det: LsEmployee) => {
  const modEl: HTMLDialogElement | null =
    document.querySelector("#modDeleteEmp");
  if (modEl) modEl.showModal();
  dataDelete.nip = det.nip;
  dataDelete.nama = det.nmlengkap;
  console.log(dataDelete);
};

const canceldeleteEmp = async () => {
  const modEl: HTMLDialogElement | null =
    document.querySelector("#modDeleteEmp");
  if (modEl) modEl.close();
};

const deleteEmp = async () => {
  canceldeleteEmp();
  isLoading.value = true;
  await deleteEmpAPI(dataDelete);
  await getLsEmp();
  isLoading.value = false;
};

const getLsEmp = async () => {
  await listEmpAPI();
  if (resListEmp.value) appStore.$state.lsEmp = resListEmp.value;
  // console.log(resListEmp.value);
};

const searchEmp = ref("");
const listEmp = computed(() => {
  if (appStore.$state.lsEmp) {
    if (searchEmp.value) {
      return appStore.$state.lsEmp.ls_employee.filter(
        ({ nmlengkap, nip, namadept, namajabatan, namastatus, email }) =>
          [nmlengkap, nip, namadept, namajabatan, namastatus, email].some(
            (val) =>
              val
                .toLowerCase()
                .includes(searchEmp.value ? searchEmp.value.toLowerCase() : "")
          )
      );
    }
    return appStore.$state.lsEmp.ls_employee;
  }
  return Array<LsEmployee>();
});

onMounted(async () => {
  if (!useAuthStore().$state.token) {
    useRouter().replace("/");
    return;
  }
  isLoading.value = true;
  await getLsEmp();
  isLoading.value = false;
});

const tableEl = ref<HTMLElement>();
const showSearchPagin = ref(false);
const srchPaginVal = ref();

const currPage = ref(1);
const paginClass = computed(() => {
  return (pagin: number) => {
    if (pagin == currPage.value) return "text-slate-50 bg-green";
    else return "text-dark-green";
  };
});

const goToFirst = () => {
  if (currPage.value != 1) {
    currPage.value = 1;
    tableEl.value?.scrollTo({ top: 0 });
  }
};

const goNext = () => {
  if (
    listEmp.value.length &&
    Math.ceil(listEmp.value.length / 20) > currPage.value
  ) {
    currPage.value = currPage.value + 1;
    tableEl.value?.scrollTo({ top: 0 });
  }
};

const goTo = (page: number) => {
  currPage.value = page;
  tableEl.value?.scrollTo({ top: 0 });
};

const goPrevious = () => {
  if (currPage.value > 1) {
    currPage.value = currPage.value - 1;
    tableEl.value?.scrollTo({ top: 0 });
  }
};

const goToLast = () => {
  if (
    listEmp.value.length &&
    currPage.value != Math.ceil(listEmp.value.length / 20)
  ) {
    currPage.value = Math.ceil(listEmp.value.length / 20);
    tableEl.value?.scrollTo({ top: 0 });
  }
};

const searchPagin = () => {
  if (srchPaginVal.value > Math.ceil((listEmp.value.length as number) / 20)) {
    currPage.value = Math.ceil((listEmp.value.length as number) / 20);
    srchPaginVal.value = currPage.value;
    tableEl.value?.scrollTo({ top: 0 });
    return;
  }
  if (srchPaginVal.value < 1) {
    currPage.value = 1;
    tableEl.value?.scrollTo({ top: 0 });
    return;
  }
  currPage.value = srchPaginVal.value;
  tableEl.value?.scrollTo({ top: 0 });
};

const pageCount = computed(() => {
  if (listEmp.value.length as number)
    return Math.ceil((listEmp.value.length as number) / 20);
  return 1;
});

const trailNumber = ref(2);
const startNumber = computed(() => {
  return currPage.value > trailNumber.value
    ? currPage.value - trailNumber.value
    : 1;
});
const endNumber = computed(() => {
  return currPage.value < pageCount.value - trailNumber.value
    ? currPage.value + trailNumber.value
    : pageCount.value;
});
const listPage = computed(() => {
  let list = Array();
  for (let i = startNumber.value; i <= endNumber.value; i++) {
    list.push(i);
  }
  return list;
});
</script>

<template>
  <div class="h-[100dvh] flex flex-col bg-lightl">
    <NavTop @logout="isLoading = !isLoading" />
    <div class="flex-grow flex flex-col p-4 overflow-auto">
      <div
        class="flex-grow p-2 shadow rounded bg-slate-50 flex flex-col gap-2 overflow-auto"
      >
        <div class="flex justify-between items-center">
          <div class="flex gap-2 items-center">
            <h1 class="font-semibold text-lg">List Pegawai</h1>
            <div class="relative" ref="btnAdd">
              <button
                @click="showAddOption"
                type="button"
                class="bg-green p-2 rounded text-slate-50 shadow"
              >
                <Icon name="mdi:plus-thick" class="text-lg" />
              </button>
              <div
                id="listAdd"
                class="hidden top-0 left-[40px] absolute bg-slate-50 shadow rounded p-2 z-50 space-y-1"
              >
                <button
                  type="button"
                  class="hover:border-b hover:border-dark-green"
                  @click="showAddEmp"
                >
                  Pegawai
                </button>
                <button
                  @click="showAddDept"
                  type="button"
                  class="hover:border-b hover:border-dark-green"
                >
                  Departemen
                </button>
                <button
                  type="button"
                  class="hover:border-b hover:border-dark-green"
                >
                  Jabatan
                </button>
                <button
                  @click="showAddStatus"
                  type="button"
                  class="hover:border-b hover:border-dark-green"
                >
                  Status
                </button>
              </div>
            </div>
          </div>
          <InputSearch placeholder="Cari Pegawai" v-model="searchEmp" />
        </div>
        <div ref="tableEl" class="flex-grow overflow-auto">
          <table class="table-auto overflow-auto w-full">
            <thead class="sticky top-0">
              <tr class="bg-dark-green text-slate-50">
                <th class="p-2">NIP</th>
                <th class="p-2 whitespace-nowrap">Nama Lengkap</th>
                <th class="p-2 whitespace-nowrap">Tgl Lahir</th>
                <th class="p-2">Tempat Lahir</th>
                <th class="p-2">Jenis Kelamin</th>
                <th class="p-2">Telepon</th>
                <th class="py-2 px-20">Alamat</th>
                <th class="p-2">Status</th>
                <th class="p-2 whitespace-nowrap">Tgl Bekerja</th>
                <th class="p-2 flex flex-wrap">
                  <span class="whitespace-nowrap">Tgl Akhir</span> Kontrak
                </th>
                <th class="p-2">Departemen</th>
                <th class="p-2">Jabatan</th>
                <th class="p-2">Email</th>
                <th class="p-2">Agama</th>
                <th class="p-2">Status Menikah</th>
                <th class="p-2">Ditambah Oleh</th>
                <th class="p-2 whitespace-nowrap">Wkt Tambah</th>
                <th class="p-2">Terakhir Update</th>
                <th class="p-2 whitespace-nowrap">Wkt Update</th>
                <th class="p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(le, index) in listEmp.slice(
                  (currPage - 1) * 20,
                  20 * currPage
                )"
                :class="{
                  'bg-gray-200': index % 2 != 0,
                  'bg-slate-50': index % 2 == 0,
                }"
                class="text-sm"
              >
                <td class="p-1">{{ le.nip }}</td>
                <td class="p-1">{{ le.nmlengkap }}</td>
                <td class="p-1">
                  {{ formatDate(le.tgllahir) }}
                </td>
                <td class="p-1">
                  {{ le.tmplahir }}
                </td>
                <td class="p-1">
                  {{ le.jnskelamin }}
                </td>
                <td class="p-1">
                  {{ le.telepon }}
                </td>
                <td class="p-1">
                  {{ le.alamat }}
                </td>
                <td class="p-1">
                  {{ le.namastatus }}
                </td>
                <td class="p-1">
                  {{ formatDate(le.tglbekerja) }}
                </td>
                <td class="p-1">
                  {{
                    le.tglakhirkontrak ? formatDate(le.tglakhirkontrak) : "-"
                  }}
                </td>
                <td class="p-1">
                  {{ le.namadept }}
                </td>
                <td class="p-1">
                  {{ le.namajabatan }}
                </td>
                <td class="p-1">
                  {{ le.email }}
                </td>
                <td class="p-1">
                  {{ le.agama }}
                </td>
                <td class="p-1">
                  {{ le.statusmenikah }}
                </td>
                <td class="p-1">
                  {{ le.addby }}
                </td>
                <td class="p-1">
                  {{ formatDate(le.addat) }}
                </td>
                <td class="p-1">{{ le.lastupdateby }}</td>
                <td class="p-1">
                  {{ formatDate(le.updateat) }}
                </td>
                <td class="p-1">
                  <span
                    class="flex-grow flex gap-2 items-center justify-center"
                  >
                    <button
                      @click="editEmp(le)"
                      type="button"
                      class="flex items-center"
                    >
                      <Icon
                        name="mdi:account-edit"
                        class="text-xl text-green"
                      />
                    </button>
                    <button
                      @click="showAlertDelete(le)"
                      type="button"
                      class="flex items-center"
                    >
                      <Icon name="mdi:delete" class="text-xl text-red-600" />
                    </button>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <div
            v-if="listEmp.length"
            class="flex flex-wrap md:justify-between sticky bottom-0 bg-white gap-2 items-end p-1"
          >
            <div class="flex gap-1 items-center">
              <div v-if="listPage.length > 1">
                <ul v-if="listEmp.length" class="flex cursor-pointer">
                  <li
                    @click="goPrevious"
                    :class="vlsMs.pagin"
                    class="px-2 py-1 flex items-center text-green justify-center rounded-l"
                  >
                    <Icon name="mdi:chevron-left" class="text-h5" />
                  </li>
                  <li
                    v-if="startNumber >= trailNumber"
                    @click="goToFirst"
                    :class="vlsMs.pagin"
                    class="px-2 py-1 flex items-center justify-center text-green"
                  >
                    1
                  </li>
                  <li
                    v-for="lp in listPage"
                    :key="lp"
                    class="px-2 py-1 flex items-center justify-center"
                    :class="[vlsMs.pagin, paginClass(lp)]"
                    @click="goTo(lp)"
                  >
                    {{ lp }}
                  </li>
                  <li
                    v-if="!showSearchPagin"
                    @click="showSearchPagin = true"
                    class="px-2 py-1 flex items-center justify-center text-green"
                    :class="vlsMs.pagin"
                  >
                    <span>...</span>
                  </li>
                  <li
                    v-else
                    class="px-2 py-1 flex items-center justify-center text-green"
                    :class="vlsMs.pagin"
                  >
                    <InputSearchPagin
                      v-model="srchPaginVal"
                      @update:model-value="searchPagin"
                      @hide-pagin="showSearchPagin = false"
                    />
                  </li>
                  <li
                    v-if="
                      currPage + trailNumber < Math.ceil(listEmp.length / 20)
                    "
                    @click="goToLast"
                    :class="vlsMs.pagin"
                    class="px-2 py-1 flex items-center justify-center text-green"
                  >
                    {{ Math.ceil(listEmp.length / 20) }}
                  </li>
                  <li
                    @click="goNext"
                    :class="vlsMs.pagin"
                    class="px-2 py-1 flex text-green items-center justify-center rounded-r"
                  >
                    <Icon name="mdi:chevron-right" class="text-h5" />
                  </li>
                </ul>
              </div>
              <p>
                {{
                  currPage == 1
                    ? 1
                    : new Intl.NumberFormat("id-ID").format(
                        (currPage - 1) * 20 + 1
                      )
                }}
                -
                {{
                  endNumber != currPage
                    ? currPage * 20
                    : new Intl.NumberFormat("id-ID").format(
                        listEmp.length as number
                      )
                }}, total
                {{
                  new Intl.NumberFormat("id-ID").format(
                    listEmp.length as number
                  )
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Loading :is-loading="isLoading" />
    <ModalTambahEmp @simpan="isLoading = !isLoading" />
    <ModalTambahDept @simpan="isLoading = !isLoading" />
    <ModalTambahStatus @simpan="isLoading = !isLoading" />
    <ModalBaseCenter id="modDeleteEmp" title="Peringatan!"
      ><p>Hapus {{ dataDelete.nama }} ({{ dataDelete.nip }})</p>
      <div class="grid grid-cols-2 gap-2">
        <button
          @click="canceldeleteEmp"
          type="button"
          class="bg-dark-green rounded shadow font-medium p-2 text-slate-50"
        >
          Tidak
        </button>
        <button
          @click="deleteEmp"
          type="button"
          class="bg-red-600 rounded shadow font-medium p-2 text-slate-50"
        >
          Ya
        </button>
      </div>
    </ModalBaseCenter>
  </div>
</template>

<style module="vlsMs">
.pagin {
  border: 1px solid #43766c;
  font-size: 12px !important;
}
</style>
