import { createSignal, type Setter, type Signal } from "solid-js";
import { createForm, email, required, type SubmitHandler } from "@modular-forms/solid";
import type { RegisterForm } from "./types.ts";
import { StyledInput } from "../form/Input.tsx";
import { usePocketbase } from "./PocketbaseProvider.tsx";
import { useLogin } from "./LoginUi.tsx";

export function useRegister(otp: Signal<string | undefined>, setError: Setter<string | undefined>) {
  const [_, setOtpId] = otp;
  const client = usePocketbase();
  const login = useLogin(otp, setError);

  return (email: string, otp?: string) => {
    setError(undefined);
    setOtpId(undefined);
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
  const otp = createSignal<string | undefined>(undefined);
  const [otpId] = otp;
  const [error, setError] = createSignal<string | undefined>(undefined);
  const register = useRegister(otp, setError);
  const [, { Form, Field }] = createForm<RegisterForm>();

  const handleLogin: SubmitHandler<RegisterForm> = ({ email, otp }) => register(email, otp);
  return <Form onSubmit={handleLogin}>
    <Field name="email"
           validate={[
             required("Bitte trag deine E-Mail Adresse ein"),
             email("Die E-Mail Adresse scheint nicht valide zu sein")
           ]}
    >
      {(store, props) =>
        <StyledInput store={store} props={props} label="E-Mail:" type="email" required={true} />
      }
    </Field>

    <Field name="otp"
           validate={[
             required("Bitte gib deinen One Time Passwort ein")
           ]}
    >
      {(store, props) =>
        <StyledInput store={store} props={props} label="Bitte gib den One Time Passwort, das du per E-Mail bekommen hast, hier ein:" />
      }
    </Field>

    {error() && <small class="text-error my-2"> {error()}</small>}
    <div class="my-2 flex justify-evenly">
      <button data-action="login" type="submit">Anmelden</button>
      <button data-action="register" type="submit">Registrieren</button>
    </div>
  </Form>;
}

