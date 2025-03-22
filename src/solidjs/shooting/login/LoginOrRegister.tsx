import { LoginUi } from "./LoginUi";
import { RegisterUi } from "./RegisterUi";

export function LoginOrRegister() {
  return <>
    <h2 class="mt-4">Registrieren oder anmelden</h2>
    <LoginUi />
    <RegisterUi />
  </>;
}