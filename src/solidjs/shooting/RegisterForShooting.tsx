import { AuthProvider } from "./login/AuthProvider.tsx";
import { PocketBaseProvider } from "./login/PocketbaseProvider.tsx";

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

function RegisterForm({ prefixes }: { prefixes: string[] }) {
  return <>
    Form
  </>;
}