import { createSignal, type Setter, type Signal } from "solid-js";
import type { InferInput } from "valibot";
import { LoginSchema } from "./LoginSchemas";
import { StyledInput } from "../form/Input";
import { useAuth } from "./AuthProvider";
import { createStyledForm, type StyledSubmitHandler } from "../form/Form";

export function useLogin(otp: Signal<string | undefined>, setError: Setter<string | undefined>) {
  const [otpId, setOtpId] = otp;
  const { requestOtp, validateOtp } = useAuth();
  return async (data: InferInput<typeof LoginSchema>) => {
    const { email } = data;
    const otp = "otp" in data ? data.otp : undefined;
    setError(undefined);
    const tokenId = otpId();
    if (tokenId !== undefined && otp !== undefined) {
      await validateOtp(tokenId, otp);
      setError(undefined);
      setOtpId(undefined);
    } else {
      const data = await requestOtp(email);
      setError(undefined);
      setOtpId(data?.otpId);
    }
  };
}

export function LoginUi() {
  const { Form, Field } = createStyledForm(LoginSchema);
  const [error, setError] = createSignal<string | undefined>(undefined);
  const otp = createSignal<string | undefined>(undefined);
  const [otpId] = otp;
  const login = useLogin(otp, setError);

  const handleLogin: StyledSubmitHandler<typeof LoginSchema> = (data) => login(data);
  return <Form onSubmit={handleLogin}>
    <StyledInput field={Field} name="email" label="E-Mail:" type="email" required={true} />
    {otpId() !== undefined && <>
      <StyledInput field={Field} name="otp" label="Bitte gib den One Time Passwort, das du per E-Mail bekommen hast, hier ein:" />
    </>}
    {error() && <small class="text-error my-2"> {error()}</small>}
    <div class="my-2 flex justify-evenly">
      <button type="submit">Anmelden</button>
    </div>
  </Form>;
}