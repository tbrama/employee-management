import type { Login } from "~/utils/interface/Login";

export const useAuthApi = () => {
  const config = useRuntimeConfig();
  const baseURL = "http://localhost";
  const authStore = useAuthStore();
  const getCSRF = async () => {
    try {
      await $fetch(baseURL + "/employee-api/public/sanctum/csrf-cookie", {
        method: "GET",
        credentials: "include",
      });
    } catch (error) {
      const textError = String(error);
      const txt = textError.replaceAll("(", "");
      const splitError = txt.split(" ");
      throw createError({
        statusCode: parseInt(splitError[2]),
        message: "CSRF",
        fatal: true,
      });
    }
  };

  const resLogin = ref<Login>();
  const loginAPI = async (data: { nip: string; pass: string }) => {
    try {
      await getCSRF();
      resLogin.value = await $fetch(
        baseURL + "/employee-api/public/api/login",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
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
        message: "Login",
        fatal: true,
      });
    }
  };

  const resLogout = ref<any>();
  const logoutAPI = async () => {
    try {
      await getCSRF();
      resLogout.value = await $fetch(
        baseURL + "/employee-api/public/api/logout",
        {
          method: "POST",
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
        message: "Logout",
        fatal: true,
      });
    }
  };

  return { getCSRF, resLogin, loginAPI, resLogout, logoutAPI };
};
