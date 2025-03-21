import { LoginUi } from "./LoginUi.tsx";
import { RegisterUi } from "./RegisterUi.tsx";


export function LoginOrRegister() {

  return <>
    <h2 class="mt-4">Registrieren oder anmelden</h2>
    <LoginUi />
    <RegisterUi />
  </>;
};