import type { JSX } from "solid-js";
import { useAuth } from "./login/AuthProvider.tsx";
import { LoginOrRegister } from "./login/LoginOrRegister.tsx";

export function EnsureLogin({ children }: JSX.ElementChildrenAttribute) {
  const { isLoggedIn, isPending,logout } = useAuth();
  return <> {!isPending() && <>
    {!isLoggedIn() && <LoginOrRegister />}
    {isLoggedIn() && <>
      <button onClick={logout}>Abmelden</button>
      {children}
    </>}
  </>}
  </>;
}