import { useAuth } from "./AuthProvider";

export function Content() {
  const {logout } = useAuth();
  return <>
    <h3>Für Shooting anmelden</h3>
    <button onclick={logout}>Abmelden</button>
  </>;
}