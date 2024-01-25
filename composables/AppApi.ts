import type { ListEmp } from "~/utils/interface/LsEmployee";

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

  return { resListEmp, listEmpAPI };
};
