import type { FieldPath, FieldValues } from "@modular-forms/solid";
import { type JSX } from "solid-js";
import type { BaseProps } from "./Form";

type Props<TFieldValues extends FieldValues, TFieldName extends FieldPath<TFieldValues>> = BaseProps<TFieldName, TFieldValues>
  & Partial<JSX.InputHTMLAttributes<HTMLInputElement>>;

export function StyledInput<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>
>({ field: Field, name, label, ...rest }: Props<TFieldValues, TFieldName>) {
  return <Field name={name}>
    {({ error }, props) => <label>
      {label}
      <input {...props} {...rest} />
      {error && <small class="text-error"> {error}</small>}
    </label>
    }
  </Field>;
}
