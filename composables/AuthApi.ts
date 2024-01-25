import type { Login } from "~/utils/interface/Login";

export const useAuthApi = () => {
  const config = useRuntimeConfig();
  const baseURL = "http://localhost";

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

  return { getCSRF, resLogin, loginAPI };
};
