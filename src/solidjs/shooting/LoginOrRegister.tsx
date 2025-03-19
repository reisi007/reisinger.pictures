import { createForm, email, required, type SubmitHandler } from "@modular-forms/solid";
import { createSignal } from "solid-js";
import { usePocketbase } from "./PocketbaseProvider";
import { useAuth } from "./AuthProvider";
import type { LoginForm } from "./LoginForm";

export function LoginOrRegister() {
  const [, { Field, Form }] = createForm<LoginForm>();
  const [otpId, setOtpId] = createSignal<string | undefined>(undefined);
  const [error, setError] = createSignal<string | undefined>(undefined);
  const client = usePocketbase();
  const { requestOtp, validateOtp } = useAuth();

  const handleLogin: SubmitHandler<LoginForm> = ({ email, otp }, event) => {
    setError(undefined);
    const { submitter } = event;
    const action = submitter?.dataset?.action ?? "login";
    const isLogin = action === "login";

    function login(email: string, otp?: string) {
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
    }

    function register(email: string) {
      setOtpId(undefined);
      client.collection("users").create({
        email, password: "123456789", passwordConfirm: "123456789"
      }).then(() => {
        login(email);
      }, () => {
        setOtpId(undefined);
        setError("Der User kann nicht angelegt werden oder existiert bereits");
      });
    }

    if (isLogin) {
      login(email, otp !== undefined && otp.length > 0 ? otp : undefined);
    } else {
      register(email);
    }
  };



  return <>
    <h2 class="mt-4">Registrieren oder anmelden</h2>
    <Form onSubmit={handleLogin}>
      <Field name="email"
             validate={[
               required("Bitte trag deine E-Mail Adresse ein"),
               email("Die E-Mail Adresse scheint nicht valide zu sein")
             ]}
      >
        {({ error }, props) =>
          <label>
            E-Mail:
            <input {...props} type="email" required />
            {error && <small class="text-error"> {error}</small>}
          </label>
        }
      </Field>
      {otpId() !== undefined && <>
        <Field name="otp"
               validate={[
                 required("Bitte gib deinen One Time Passwort ein")
               ]}
        >
          {({ error }, props) =>
            <label>
              Bitte gib den One Time Passwort, das du per E-Mail bekommen hast, hier ein:
              <input {...props} type="text" required />
              {error && <small class="text-error"> {error}</small>}
            </label>
          }
        </Field>
      </>}
      {error() && <small class="text-error my-2"> {error()}</small>}
      <div class="my-2 flex justify-evenly">
        <button data-action="login" type="submit">Anmelden</button>
        <button data-action="register" type="submit">Registrieren</button>
      </div>

    </Form>
  </>;
}