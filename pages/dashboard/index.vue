<script lang="ts" setup>
import type { LsEmployee } from "~/utils/interface/LsEmployee";
import dayjs from "dayjs";
import idr from "dayjs/locale/id";

const { resListEmp, listEmpAPI } = useAppApi();
const isLoading = ref(false);

const getLsEmp = async () => {
  await listEmpAPI();
  console.log(resListEmp.value);
};

const searchEmp = ref("");
const listEmp = computed(() => {
  if (resListEmp.value) {
    if (searchEmp.value) {
      return resListEmp.value.ls_employee.filter(
        ({ nmlengkap, nip, namadept, namajabatan, namastatus, email }) =>
          [nmlengkap, nip, namadept, namajabatan, namastatus, email].some(
            (val) =>
              val
                .toLowerCase()
                .includes(searchEmp.value ? searchEmp.value.toLowerCase() : "")
          )
      );
    }
    return resListEmp.value.ls_employee;
  }
  return Array<LsEmployee>();
});

onMounted(async () => {
  isLoading.value = true;
  await getLsEmp();
  isLoading.value = false;
});
</script>

<template>
  <div class="h-[100dvh] flex flex-col bg-lightl">
    <NavTop />
    <div class="flex-grow flex flex-col p-4 overflow-auto">
      <div
        class="flex-grow p-2 shadow rounded bg-slate-50 flex flex-col gap-2 overflow-auto"
      >
        <div class="flex justify-between">
          <h1 class="font-semibold text-lg">List Karyawan</h1>
          <InputSearch placeholder="Cari Karyawan" v-model="searchEmp" />
        </div>
        <div class="flex-grow overflow-auto">
          <table class="table-auto overflow-auto">
            <thead class="sticky top-0">
              <tr class="bg-brown text-slate-50">
                <th class="p-2">NIP</th>
                <th class="p-2 whitespace-nowrap">Nama Lengkap</th>
                <th class="p-2 whitespace-nowrap">Tgl Lahir</th>
                <th class="p-2">Tempat Lahir</th>
                <th class="p-2">Jenis Kelamin</th>
                <th class="p-2">Telepon</th>
                <th class="p-2">Alamat</th>
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
              <template v-for="n in 60">
                <tr
                  v-for="(le, index) in listEmp"
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
                      <button type="button" class="flex items-center">
                        <Icon
                          name="mdi:account-edit"
                          class="text-xl text-green"
                        />
                      </button>
                      <button type="button" class="flex items-center">
                        <Icon name="mdi:delete" class="text-xl text-red-600" />
                      </button>
                    </span>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <Loading :is-loading="isLoading" />
  </div>
</template>

<style scoped></style>
