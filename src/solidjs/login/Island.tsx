import type { JSX } from "solid-js";
import { PocketBaseProvider } from "./PocketbaseProvider";
import { AuthProvider } from "./AuthProvider";
import { EnsureLogin } from "./EnsureLogin";

export function LoginIsland(props: { children: JSX.Element }) {
  return <PocketBaseProvider url="https://backend.reisinger.pictures">
    <AuthProvider>
      <EnsureLogin>
        {props.children}
      </EnsureLogin>
    </AuthProvider>
  </PocketBaseProvider>;
}