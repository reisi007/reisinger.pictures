import { createContext, createEffect, createSignal, type JSX, onCleanup, onMount, useContext } from "solid-js";
import { type OTPResponse, type RecordAuthResponse } from "pocketbase";
import { usePocketbase } from "./PocketbaseProvider";

export const AuthContext = createContext<{
  isLoggedIn: () => boolean
  isPending: () => boolean
  requestOtp: (email: string) => Promise<OTPResponse | undefined>
  validateOtp: (otpId: string, otp: string) => Promise<RecordAuthResponse | undefined>
  logout: () => void
}>();

type AuthProviderProps = {
  children: JSX.Element;
}

const UNSET_VALUE = "===UNSET===";

export const AuthProvider = (props: AuthProviderProps) => {
  const client = usePocketbase();

  if (!client) {
    throw new Error("useAuth must be used within a <PocketBaseProvider>");
  }

  const [token, setToken] = createSignal<string | null>(UNSET_VALUE);

  createEffect(() => {
    const unsubscribe = client.authStore.onChange(auth => {
      if (auth) {
        setToken(auth);
        sessionStorage.setItem("auth", client.authStore.exportToCookie());
      } else {
        setToken(null);
        sessionStorage.removeItem("auth");
      }
    });
    onCleanup(() => unsubscribe());
  });

  onMount(() => {
    const authData = sessionStorage.getItem("auth");
    if (authData !== null)
      client.authStore.loadFromCookie(authData);
    else setToken(null);
  });


  function logout() {
    client?.authStore?.clear();
  }

  async function requestOtp(email: string) {
    return client?.collection("users")?.requestOTP(email);
  }

  async function validateOtp(otpId: string, otp: string) {
    return client?.collection("users")?.authWithOTP(otpId, otp);
  }

  return (
    <AuthContext.Provider value={{
      isLoggedIn: () => token() !== null,
      isPending: () => token() === UNSET_VALUE,
      logout,
      requestOtp,
      validateOtp
    }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("usePocketbase must be used within a <AuthProvider>");
  return context;
}