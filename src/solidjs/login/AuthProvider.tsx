import { createContext, createEffect, createSignal, type JSX, onCleanup, onMount, useContext } from "solid-js";
import { type OTPResponse, type RecordAuthResponse } from "pocketbase";
import { usePocketbase } from "./PocketbaseProvider";

const AuthContext = createContext<{
  isLoggedIn: () => boolean
  isPending: () => boolean
  userId: () => string | undefined,
  requestOtp: (email: string) => Promise<OTPResponse | undefined>
  validateOtp: (otpId: string, otp: string) => Promise<RecordAuthResponse | undefined>
  logout: () => void
}>();


const UNSET_VALUE = "===UNSET===";

export const AuthProvider = (props: { children: JSX.Element }) => {
  const client = usePocketbase();

  if (!client) {
    throw new Error("useAuth must be used within a <PocketBaseProvider>");
  }

  const [userId, setUserId] = createSignal<string | undefined>(UNSET_VALUE);

  createEffect(() => {
    const unsubscribe = client.authStore.onChange(auth => {
      if (auth) {
        localStorage.setItem("auth", client.authStore.exportToCookie());
        setUserId(client.authStore.record?.id);
      } else {
        setUserId(undefined);
        localStorage.removeItem("auth");
      }
    });
    onCleanup(() => unsubscribe());
  });

  onMount(() => {
    const authData = localStorage.getItem("auth");
    if (authData !== null) {
      client.authStore.loadFromCookie(authData);
      setUserId(client.authStore.record?.id);
    } else {
      setUserId(undefined);
    }
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

  function isPending() {
    return userId() === UNSET_VALUE;
  }

  return (
    <AuthContext.Provider value={{
      isLoggedIn: () => !isPending() && userId() !== undefined,
      userId: () => isPending() ? undefined : userId(),
      isPending,
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
  if (context === undefined) throw new Error("useAuth must be used within a <PocketBaseProvider>");
  return context;
}
