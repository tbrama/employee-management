import type {
  ListEmp,
  LsEmployee,
  Options,
} from "~/utils/interface/LsEmployee";
import type { LsJabAll } from "~/utils/interface/LsJabAll";

export const useAppStore = defineStore("app", () => {
  const detEmp = ref<LsEmployee>({
    nip: "",
    nmlengkap: "",
    tgllahir: "",
    tmplahir: "",
    jnskelamin: "",
    alamat: "",
    telepon: "",
    tglbekerja: "",
    tglakhirkontrak: "",
    namastatus: "",
    namadept: "",
    namajabatan: "",
    email: "",
    agama: "",
    statusmenikah: "",
    addby: "",
    addat: "",
    lastupdateby: "",
    updateat: "",
  });
  const lsEmp = ref<null | ListEmp>(null);
  const lsJabat = ref<Options[] | null>(null);
  const isEdit = ref(false);
  const lsJabAll = ref<LsJabAll[] | null>(null);

  return {
    detEmp,
    lsEmp,
    lsJabat,
    isEdit,
    lsJabAll,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot));
}
