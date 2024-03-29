import type {
  ListEmp,
  LsEmployee,
  Options,
} from "~/utils/interface/LsEmployee";
import type { LsJabAll } from "~/utils/interface/LsJabAll";

export const useAppApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.production_mode
    ? "https://api2.champ-group.com"
    : "http://localhost";
  const authStore = useAuthStore();
  const { getCSRF } = useAuthApi();

  const resListEmp = ref<ListEmp>();
  const listEmpAPI = async () => {
    try {
      await getCSRF();
      resListEmp.value = await $fetch(
        baseURL + "/employee-api/public/api/listemp",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authStore.$state.token}`,
          },
          // body: data,
        }
      );
    } catch (error) {
      const textError = String(error);
      const txt = textError.replaceAll("(", "");
      const splitError = txt.split(" ");
      throw createError({
        statusCode: parseInt(splitError[2]),
        message: "List Employee",
        fatal: true,
      });
    }
  };

  const resListJabat = ref<Options[] | null>(null);
  const listJabatAPI = async (dept: string) => {
    try {
      await getCSRF();
      resListJabat.value = await $fetch(
        baseURL + "/employee-api/public/api/listjabatan/" + dept,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authStore.$state.token}`,
          },
          // body: data,
        }
      );
    } catch (error) {
      const textError = String(error);
      const txt = textError.replaceAll("(", "");
      const splitError = txt.split(" ");
      throw createError({
        statusCode: parseInt(splitError[2]),
        message: "List Jabatan",
        fatal: true,
      });
    }
  };

  const resAddEmp = ref<any>();
  const addEmpAPI = async (data: LsEmployee) => {
    try {
      await getCSRF();
      resAddEmp.value = await $fetch(
        baseURL + "/employee-api/public/api/addemp",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authStore.$state.token}`,
          },
          body: data,
        }
      );
    } catch (error) {
      const textError = String(error);
      const txt = textError.replaceAll("(", "");
      const splitError = txt.split(" ");
      throw createError({
        statusCode: parseInt(splitError[2]),
        message: "Add Employee",
        fatal: true,
      });
    }
  };

  const resUpdateEmp = ref<any>();
  const updateEmpAPI = async (data: LsEmployee) => {
    try {
      await getCSRF();
      resUpdateEmp.value = await $fetch(
        baseURL + "/employee-api/public/api/updateemp",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authStore.$state.token}`,
          },
          body: data,
        }
      );
    } catch (error) {
      const textError = String(error);
      const txt = textError.replaceAll("(", "");
      const splitError = txt.split(" ");
      throw createError({
        statusCode: parseInt(splitError[2]),
        message: "Update Employee",
        fatal: true,
      });
    }
  };

  const resDeleteEmp = ref<any>();
  const deleteEmpAPI = async (data: { nip: string; updateby: string }) => {
    try {
      await getCSRF();
      resDeleteEmp.value = await $fetch(
        baseURL + "/employee-api/public/api/deleteemp",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authStore.$state.token}`,
          },
          body: data,
        }
      );
    } catch (error) {
      const textError = String(error);
      const txt = textError.replaceAll("(", "");
      const splitError = txt.split(" ");
      throw createError({
        statusCode: parseInt(splitError[2]),
        message: "Delete Employee",
        fatal: true,
      });
    }
  };

  const resAddDept = ref<any>();
  const addDeptAPI = async (data: { nip: string; namadept: string }) => {
    try {
      await getCSRF();
      resAddDept.value = await $fetch(
        baseURL + "/employee-api/public/api/adddepartemen",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authStore.$state.token}`,
          },
          body: data,
        }
      );
    } catch (error) {
      const textError = String(error);
      const txt = textError.replaceAll("(", "");
      const splitError = txt.split(" ");
      throw createError({
        statusCode: parseInt(splitError[2]),
        message: "add departemen Employee",
        fatal: true,
      });
    }
  };

  const resLsDept = ref<Options[]>();
  const lsDeptAPI = async () => {
    try {
      await getCSRF();
      resLsDept.value = await $fetch(
        baseURL + "/employee-api/public/api/listdept",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authStore.$state.token}`,
          },
        }
      );
    } catch (error) {
      const textError = String(error);
      const txt = textError.replaceAll("(", "");
      const splitError = txt.split(" ");
      throw createError({
        statusCode: parseInt(splitError[2]),
        message: "list departemen Employee",
        fatal: true,
      });
    }
  };

  const resAddStatus = ref<any>();
  const addStatusAPI = async (data: { nip: string; namastatus: string }) => {
    try {
      await getCSRF();
      resAddStatus.value = await $fetch(
        baseURL + "/employee-api/public/api/addstatus",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authStore.$state.token}`,
          },
          body: data,
        }
      );
    } catch (error) {
      const textError = String(error);
      const txt = textError.replaceAll("(", "");
      const splitError = txt.split(" ");
      throw createError({
        statusCode: parseInt(splitError[2]),
        message: "add status Employee",
        fatal: true,
      });
    }
  };

  const resLsStatus = ref<Options[]>();
  const lsStatusAPI = async () => {
    try {
      await getCSRF();
      resLsStatus.value = await $fetch(
        baseURL + "/employee-api/public/api/liststatus",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authStore.$state.token}`,
          },
        }
      );
    } catch (error) {
      const textError = String(error);
      const txt = textError.replaceAll("(", "");
      const splitError = txt.split(" ");
      throw createError({
        statusCode: parseInt(splitError[2]),
        message: "list status Employee",
        fatal: true,
      });
    }
  };

  const resAddJabatan = ref<any>();
  const addJabatanAPI = async (data: {
    nip: string;
    namajab: string;
    iddept: string;
  }) => {
    try {
      await getCSRF();
      resAddJabatan.value = await $fetch(
        baseURL + "/employee-api/public/api/addjabatan",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authStore.$state.token}`,
          },
          body: data,
        }
      );
    } catch (error) {
      const textError = String(error);
      const txt = textError.replaceAll("(", "");
      const splitError = txt.split(" ");
      throw createError({
        statusCode: parseInt(splitError[2]),
        message: "add jabatan Employee",
        fatal: true,
      });
    }
  };

  const resLsJabAll = ref<LsJabAll[]>();
  const lsJabAllAPI = async () => {
    try {
      await getCSRF();
      resLsJabAll.value = await $fetch(
        baseURL + "/employee-api/public/api/listjabatanall",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authStore.$state.token}`,
          },
        }
      );
    } catch (error) {
      const textError = String(error);
      const txt = textError.replaceAll("(", "");
      const splitError = txt.split(" ");
      throw createError({
        statusCode: parseInt(splitError[2]),
        message: "list jabatan all Employee",
        fatal: true,
      });
    }
  };

  return {
    resListEmp,
    listEmpAPI,
    resListJabat,
    listJabatAPI,
    resAddEmp,
    addEmpAPI,
    resDeleteEmp,
    deleteEmpAPI,
    resUpdateEmp,
    updateEmpAPI,
    resAddDept,
    addDeptAPI,
    resLsDept,
    lsDeptAPI,
    resAddStatus,
    addStatusAPI,
    resLsStatus,
    lsStatusAPI,
    resAddJabatan,
    addJabatanAPI,
    resLsJabAll,
    lsJabAllAPI,
  };
};
