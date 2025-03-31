import type { JSX } from "solid-js";
import { useAuth } from "./AuthProvider.tsx";
import { LoginOrRegister } from "./LoginOrRegister.tsx";

export function EnsureLogin(props: { children: JSX.Element }) {
  const { isLoggedIn, isPending, logout } = useAuth();

  return <div class="border p-4 rounded-xl"> {!isPending() && <>
    {!isLoggedIn() && <LoginOrRegister />}
    {isLoggedIn() && <div class="flex flex-col">
      <button class="mb-4 p-2 text-sm self-end" onClick={logout}>Abmelden</button>
      {props.children}
    </div>}
  </>}
  </div>;
}