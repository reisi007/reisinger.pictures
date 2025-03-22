import { AuthProvider } from "./login/AuthProvider";
import { PocketBaseProvider } from "./login/PocketbaseProvider";

const RegisterForm = ({ prefixes }: { prefixes: string[] }) => <>
  Form
</>;

export function RegisterForShooting({ prefixes }: { prefixes: string[] }) {
  return <>
    <h3>Für Shooting anmelden</h3>
    <PocketBaseProvider url="https://backend.reisinger.pictures">
      <AuthProvider>
        <RegisterForm prefixes={prefixes} />
      </AuthProvider>
    </PocketBaseProvider>
  </>;
}