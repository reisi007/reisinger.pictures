import { LoginUi } from "./LoginUi.tsx";
import { RegisterUi } from "./RegisterUi.tsx";

export function LoginOrRegister() {
  return <>
    <h4 class="mt-4 -mb-2">Anmelden</h4>
    <LoginUi />

    <h4 class="mt-4 -mb-2">Registrieren</h4>
    <RegisterUi />
  </>;
}