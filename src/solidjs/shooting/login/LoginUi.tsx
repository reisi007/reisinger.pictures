import { createSignal, type Setter, type Signal } from "solid-js";
import { createForm, email, required, type SubmitHandler } from "@modular-forms/solid";
import type { LoginForm } from "./types.ts";
import { StyledInput } from "../form/Input.tsx";
import { useAuth } from "./AuthProvider.tsx";

export function useLogin(otp: Signal<string | undefined>, setError: Setter<string | undefined>) {
  const [otpId, setOtpId] = otp;
  const { requestOtp, validateOtp } = useAuth();
  return (email: string, otp?: string) => {
    setError(undefined);
    const tokenId = otpId();
    if (tokenId !== undefined && otp !== undefined) {
      validateOtp(tokenId, otp)
        .then(() => {
          setError(undefined);
          setOtpId(undefined);
        });
    } else {
      requestOtp(email).then((data) => {
        setError(undefined);
        setOtpId(data?.otpId);
      });
    }
  };
}

export function LoginUi() {
  const [, { Form, Field }] = createForm<LoginForm>();
  const [error, setError] = createSignal<string | undefined>(undefined);
  const otp = createSignal<string | undefined>(undefined);
  const [otpId] = otp;
  const login = useLogin(otp, setError);

  const handleLogin: SubmitHandler<LoginForm> = ({ email, otp }) => login(email, otp);
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
    {otpId() !== undefined && <>
      <Field name="otp"
             validate={[
               required("Bitte gib deinen One Time Passwort ein")
             ]}
      >
        {(store, props) =>
          <StyledInput store={store} props={props} label="Bitte gib den One Time Passwort, das du per E-Mail bekommen hast, hier ein:" />
        }
      </Field>
    </>}
    {error() && <small class="text-error my-2"> {error()}</small>}
    <div class="my-2 flex justify-evenly">
      <button data-action="login" type="submit">Anmelden</button>
      <button data-action="register" type="submit">Registrieren</button>
    </div>
  </Form>;
}