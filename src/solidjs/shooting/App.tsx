import { useAuth } from "./AuthProvider";
import { LoginOrRegister } from "./LoginOrRegister";
import { Content } from "./Content";

export function App() {
  const { isLoggedIn, isPending } = useAuth();
  return <> {!isPending() && <>
    {!isLoggedIn() && <LoginOrRegister />}
    {isLoggedIn() && <Content />}
  </>}
  </>;
}