import { AuthProvider } from "./AuthProvider";
import { PocketBaseProvider } from "./PocketbaseProvider";
import { App } from "./App";

export function RegisterForShooting() {
  return <PocketBaseProvider url="https://backend.reisinger.pictures">
    <AuthProvider>
      <App />
    </AuthProvider>
  </PocketBaseProvider>;

}
