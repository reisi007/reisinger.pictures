import { createSignal, type Setter, type Signal } from "solid-js";
import type { InferInput } from "valibot";
import { RegisterSchema } from "./LoginSchemas";
import { StyledInput } from "../form/Input";
import { usePocketbase } from "./PocketbaseProvider";
import { createStyledForm, type StyledSubmitHandler } from "../form/Form";
import { useLogin } from "./LoginUi";

export function useRegister(otp: Signal<string | undefined>, setError: Setter<string | undefined>) {
  const client = usePocketbase();
  const [otpId, setOtpId] = otp;
  const login = useLogin(otp, setError);
  return (data: InferInput<typeof RegisterSchema>) => {
    const { email, ...other } = data;
    setError(undefined);
    const tokenId = otpId();
    const otp = "otp" in data ? data.otp : undefined;
    if (tokenId !== undefined && otp !== undefined) {
      return login(data);
    }

    return client.collection("users").create({
      username: email,
      email,
      password: "123456789",
      passwordConfirm: "123456789",
      ...other
    }).then(async () => login(data), () => {
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

  const handleLogin: StyledSubmitHandler<typeof RegisterSchema> = (data) => register(data);

  const firstStep = () => otpId() === undefined;
  return <Form onSubmit={handleLogin}>
    <StyledInput field={Field} name="email" label="E-Mail:" type="email" required={true} />
    {firstStep() && <>
      <StyledInput field={Field} name="firstName" label="Vorname" required={true} />
      <StyledInput field={Field} name="lastName" label="Nachname" required={true} />
      <StyledInput field={Field} name="tel" label="Telefonnummer (+43 123 456 789)" type="tel" required={true} />
    </>}
    {!firstStep() && <>
      <StyledInput field={Field} name="otp" label="Bitte gib den One Time Passwort, das du per E-Mail bekommen hast, hier ein:" />
    </>}
    {error() && <small class="text-error my-2"> {error()}</small>}
    <div class="my-2 flex justify-evenly">
      <button type="submit">Registrieren</button>
    </div>
  </Form>;
}

