import { createSignal, type Setter, type Signal } from "solid-js";
import { LoginSchema } from "./LoginSchemas";
import { StyledInput } from "../form/Input";
import { useAuth } from "./AuthProvider";
import { createStyledForm, type StyledSubmitHandler } from "../form/Form";

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
  const { Form, Field } = createStyledForm(LoginSchema);
  const [error, setError] = createSignal<string | undefined>(undefined);
  const otp = createSignal<string | undefined>(undefined);
  const [otpId] = otp;
  const login = useLogin(otp, setError);

  const handleLogin: StyledSubmitHandler<typeof LoginSchema> = ({ email, otp }) => login(email, otp);
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