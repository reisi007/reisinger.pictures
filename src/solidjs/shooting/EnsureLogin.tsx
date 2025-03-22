import type { JSX } from "solid-js";
import { useAuth } from "./login/AuthProvider";
import { LoginOrRegister } from "./login/LoginOrRegister";

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