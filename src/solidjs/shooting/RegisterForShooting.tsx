import { nonEmpty, object, pipe, string } from "valibot";
import { createSignal } from "solid-js";
import { AuthProvider } from "../login/AuthProvider";
import { PocketBaseProvider, useCurrentUserId, usePocketbase } from "../login/PocketbaseProvider";
import { createStyledForm, type StyledSubmitHandler } from "../form/Form";
import { StyledTextarea } from "../form/Textarea";

const RegisterSchema = object({
  text: pipe(
    string(),
    nonEmpty("Bitte trage ein welche Art von Shooting du gerne machen würdest")
  )
});

const RegisterForm = () => {
  const { Field, Form } = createStyledForm(RegisterSchema);
  const client = usePocketbase();
  const userId = useCurrentUserId();
  const [error, setError] = createSignal<string | undefined>(undefined);

  const createRequest: StyledSubmitHandler<typeof RegisterSchema> = ({ text }) => client.collection("shootings").create({
    user: userId,
    text
  }).then(value => value, () => setError("Das Shooting konnte nicht angelegt werden"));

  return <Form onSubmit={createRequest}>
    <StyledTextarea field={Field} rows={5} name="text"
                    label="Beschreibe dein Wunschshooting" />
    {error() && <small class="text-error my-2"> {error()}</small>}
    <div class="my-2 flex justify-evenly">
      <button type="submit">Absenden</button>
    </div>
  </Form>;
};

export const RegisterForShooting = () => <>
  <h3>Für Shooting anmelden</h3>
  <PocketBaseProvider url="https://backend.reisinger.pictures">
    <AuthProvider>
      <RegisterForm />
    </AuthProvider>
  </PocketBaseProvider>
</>;


