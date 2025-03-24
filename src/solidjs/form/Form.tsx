import type { FieldPath, FieldValues, SubmitHandler } from "@modular-forms/solid";
import { createForm, valiForm } from "@modular-forms/solid";
import type { BaseSchema, BaseSchemaAsync, InferInput } from "valibot";

export function createStyledForm<TSchema extends AnySchema>(schema: TSchema) {
  type TFieldValues = InferInput<TSchema>
  const form = createForm<TFieldValues>({
    validate: valiForm(schema)
  });
  return { ...form[1], store: form[0] };
}

export type ModularField<TFieldName extends FieldPath<TFieldValues>, TFieldValues extends FieldValues> = ReturnType<typeof createForm<TFieldValues, TFieldName>>[1]["Field"]

export type BaseProps<TFieldName extends FieldPath<TFieldValues>, TFieldValues extends FieldValues> = {
  field: ModularField<TFieldName, TFieldValues>,
  name: TFieldName,
  label: string
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySchema = BaseSchema<any, any, any> | BaseSchemaAsync<any, any, any>;

// Generic MySubmitHandler type
export type StyledSubmitHandler<TSchema extends AnySchema> = SubmitHandler<InferInput<TSchema>>;