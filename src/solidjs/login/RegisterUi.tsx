import { createSignal, type Setter, type Signal } from "solid-js";
import type { InferInput } from "valibot";
import { RegisterSchema } from "./LoginSchemas";
import { StyledInput } from "../form/Input";
import { usePocketbase } from "./PocketbaseProvider";
import { useLogin } from "./LoginUi";
import { createStyledForm, type StyledSubmitHandler } from "../form/Form";

export function useRegister(otp: Signal<string | undefined>, setError: Setter<string | undefined>) {
  const [, setOtpId] = otp;
  const client = usePocketbase();
  const login = useLogin(otp, setError);

  return (data: InferInput<typeof RegisterSchema>) => {
    const { email, otp, ...other } = data;
    setError(undefined);
    setOtpId(undefined);
    if (otp !== undefined) {
      login(email, otp);
      return;
    }

    client.collection("users").create({
      username: email,
      email,
      password: "123456789",
      passwordConfirm: "123456789",
      ...other
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

  const firstStep = otpId() === undefined;
  const secondStep = !firstStep;

  const handleLogin: StyledSubmitHandler<typeof RegisterSchema> = (data) => register(data);

  return <Form onSubmit={handleLogin}>
    <StyledInput field={Field} name="email" label="E-Mail:" type="email" required={true} />
    {firstStep && <>
      <StyledInput field={Field} name="firstName" label="Vorname" required={true} />
      <StyledInput field={Field} name="lastName" label="Nachname" required={true} />
      <StyledInput field={Field} name="tel" label="Telefonnummer (+43 123 456 789)" type="tel" required={true} />
    </>}
    {secondStep && <>
      <StyledInput field={Field} name="otp" label="Bitte gib den One Time Passwort, das du per E-Mail bekommen hast, hier ein:" />
    </>}
    {error() && <small class="text-error my-2"> {error()}</small>}
    <div class="my-2 flex justify-evenly">
      {firstStep && <button type="submit">Registrieren</button>}
      {secondStep && <button type="submit">Anmelden</button>}
    </div>
  </Form>;
}

