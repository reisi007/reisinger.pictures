import { createSignal, type Setter, type Signal } from "solid-js";
import { RegisterSchema } from "./LoginSchemas";
import { StyledInput } from "../form/Input";
import { usePocketbase } from "./PocketbaseProvider";
import { useLogin } from "./LoginUi";
import { createStyledForm, type StyledSubmitHandler } from "../form/Form";

export function useRegister(otp: Signal<string | undefined>, setError: Setter<string | undefined>) {
  const [, setOtpId] = otp;
  const client = usePocketbase();
  const login = useLogin(otp, setError);

  return (email: string, otp?: string) => {
    setError(undefined);
    setOtpId(undefined);
    if (otp !== undefined) {
      login(email, otp);
      return;
    }
    client.collection("users").create({
      email, password: "123456789", passwordConfirm: "123456789"
    }).then(() => {
      login(email, undefined);
    }, () => {
      setOtpId(undefined);
      setError("Der User kann nicht angelegt werden oder existiert bereits");
    });
  };
}

export function RegisterUi() {
  const { Form, Field } = createStyledForm(RegisterSchema);
  const [error, setError] = createSignal<string | undefined>(undefined);
  const otp = createSignal<string | undefined>(undefined);
  const [otpId] = otp;
  const register = useRegister(otp, setError);

  const handleLogin: StyledSubmitHandler<typeof RegisterSchema> = ({ email, otp }) => register(email, otp);
  return <Form onSubmit={handleLogin}>
    <StyledInput field={Field} name="email" label="E-Mail:" type="email" required={true} />
    {otpId() !== undefined && <>
      <StyledInput field={Field} name="otp" label="Bitte gib den One Time Passwort, das du per E-Mail bekommen hast, hier ein:" />
    </>}
    {error() && <small class="text-error my-2"> {error()}</small>}
    <div class="my-2 flex justify-evenly">
      <button data-action="login" type="submit">Anmelden</button>
      <button data-action="register" type="submit">Registrieren</button>
    </div>
  </Form>;
}

