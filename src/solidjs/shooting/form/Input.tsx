import type { FieldElementProps, FieldPath, FieldStore, FieldValues } from "@modular-forms/solid";
import { type JSX } from "solid-js";

type Props<TFieldValues extends FieldValues, TFieldName extends FieldPath<TFieldValues>> = {
  store: FieldStore<TFieldValues, TFieldName>,
  props: FieldElementProps<TFieldValues, TFieldName>
  label: string
  type?: JSX.InputHTMLAttributes<unknown>["type"]
  required?: boolean
};

export function StyledInput<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
>({ store, props, type = "text", label,required=false }: Props<TFieldValues, TFieldName>) {
  const { error } = store;
  return <label>
    {label}
    <input {...props} type={type} required={required} />
    {error && <small class="text-error"> {error}</small>}
  </label>;
}