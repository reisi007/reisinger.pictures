import type { JSX } from "solid-js";
import { PocketBaseProvider } from "./PocketbaseProvider.tsx";
import { AuthProvider } from "./AuthProvider.tsx";
import { EnsureLogin } from "./EnsureLogin.tsx";

export function LoginIsland(props: { children: JSX.Element }) {
  return <PocketBaseProvider url="https://backend.reisinger.pictures">
    <AuthProvider>
      <EnsureLogin>
        {props.children}
      </EnsureLogin>
    </AuthProvider>
  </PocketBaseProvider>;
}