import { nonEmpty, object, pipe, string } from "valibot";
import { createSignal } from "solid-js";
import { reset } from "@modular-forms/solid";
import { useAuth } from "../login/AuthProvider.tsx";
import { createStyledForm, type StyledSubmitHandler } from "../form/Form.tsx";
import { StyledTextarea } from "../form/Textarea.tsx";
import { createPocketbase } from "../login/PocketbaseProvider.tsx";
import { LoginIsland } from "../login/Island.tsx";
import { createPocketbaseResource } from "../pocketbase.ts";
import type { ShootingIdeenResponse } from "../pocketbase.types.ts";

const RegisterSchema = object({
  text: pipe(
    string(),
    nonEmpty("Bitte trage ein welche Art von Shooting du gerne machen würdest")
  )
});

const RegisterForm = () => {
  const { Field, Form, store } = createStyledForm(RegisterSchema);

  const client = createPocketbase();
  const [error, setError] = createSignal<string | undefined>(undefined);
  const { userId } = useAuth();


  const createRequest: StyledSubmitHandler<typeof RegisterSchema> = ({ text }) => client.collection("registrierung").create({
    user: userId(),
    text
  }).then(() => reset(store), () => setError("Das Shooting konnte nicht angelegt werden"));

  return <Form onSubmit={createRequest}>
    <StyledTextarea field={Field} rows={5} name="text" required={true}
                    label="Beschreibe dein Wunschshooting" />
    {error() && <small class="text-error my-2"> {error()}</small>}
    <div class="my-2 flex justify-evenly">
      <button type="submit">Absenden</button>
    </div>
  </Form>;
};

const ShootingIdeen = () => {
  const [data] = createPocketbaseResource<ShootingIdeenResponse>("shooting_ideen", {
    fields: "id,title,description"
  });
  return <>{data() !== undefined && <ul>
    {data()?.map(e => <li><b class="mr-1">{e.title}:</b> {e.description}</li>)}
  </ul>}</>;
};

export const RegisterForShooting = () => <>
  <h3>Für Shooting anmelden</h3>
  <LoginIsland>
    <h4>Ideen</h4>
    <ShootingIdeen />
    <small>Wenn du eine kreative Idee hast, zögere nicht die mir zu schicken</small>
    <h4>Für Fotoshooting anmelden</h4>
    <RegisterForm />
  </LoginIsland>
</>;


