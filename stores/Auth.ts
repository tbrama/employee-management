import SecureLS from "secure-ls";
import type { DataLogin } from "~/utils/interface/Login";

const config = useRuntimeConfig();

const ls = new SecureLS({
  encodingType: "aes",
  isCompression: false,
  encryptionSecret: config.keyLs,
});

let profileLs: DataLogin | null, tokenLs: string;

try {
  profileLs = ls.get("prfEmp");
  tokenLs = ls.get("tknEmp");
} catch (error) {
  localStorage.clear();
  location.reload();
}

export const useAuthStore = defineStore("auth", () => {
  const profile = ref<DataLogin | null>(profileLs ? profileLs : null);
  const token = ref<string>(tokenLs ? tokenLs : "");

  const setProfile = (profileP: DataLogin) => {
    profile.value = profileP;
    ls.set("prfEmp", profile.value);
  };
  const resetProfile = () => {
    profile.value = null;
    ls.set("prfEmp", profile.value);
  };

  const setToken = (tkn: string) => {
    token.value = tkn;
    ls.set("tknEmp", token.value);
  };
  const resetToken = () => {
    token.value = "";
    ls.set("tknEmp", token.value);
  };

  return {
    profile,
    setProfile,
    resetProfile,
    token,
    setToken,
    resetToken,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
