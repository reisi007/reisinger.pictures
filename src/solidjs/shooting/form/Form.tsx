import type { FieldElementProps, FieldPath, FieldValues, SubmitHandler } from "@modular-forms/solid";
import { createForm, valiForm } from "@modular-forms/solid";
import type { BaseSchema, BaseSchemaAsync, GenericSchema, GenericSchemaAsync, InferInput } from "valibot";
import type { JSX } from "solid-js";

export function createStyledForm<TSchema extends AnySchema>(schema: GenericSchema | GenericSchemaAsync) {
  type TFieldValues = InferInput<TSchema>
  const form = createForm<TFieldValues>({
    validate: valiForm(schema)
  });
  return form[1];
}

export type ModularField<TFieldName extends FieldPath<TFieldValues>, TFieldValues extends FieldValues> = (props: {
  name: TFieldName,
  children: (store: { error: string }, props: FieldElementProps<TFieldValues, TFieldName>) => JSX.Element
}) => JSX.Element;

export type BaseProps<TFieldName extends FieldPath<TFieldValues>, TFieldValues extends FieldValues> = {
  field: ModularField<TFieldName, TFieldValues>,
  name: TFieldName,
  label: string
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySchema = BaseSchema<any, any, any> | BaseSchemaAsync<any, any, any>;

// Generic MySubmitHandler type
export type StyledSubmitHandler<TSchema extends AnySchema> = SubmitHandler<InferInput<TSchema>>;