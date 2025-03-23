import { email, nonEmpty, object, optional, pipe, regex, string } from "valibot";

export const LoginSchema = object({
  email: pipe(
    string(),
    nonEmpty("Bitte trag deine E-Mail Adresse ein"),
    email("Die E-Mail Adresse scheint nicht valide zu sein")
  ),
  otp: optional(string())
});

export const RegisterSchema = object({
  email: pipe(
    string(),
    nonEmpty("Bitte trag deine E-Mail Adresse ein"),
    email("Die E-Mail Adresse scheint nicht valide zu sein")
  ),
  otp: optional(string()),
  firstName: pipe(
    string(),
    nonEmpty("Bitte trag deinen Vornamen ein")
  ),
  lastName: pipe(
    string(),
    nonEmpty("Bitte trag deinen Nachnamen ein")
  ),
  tel: pipe(
    string(),
    nonEmpty("Bitte trag deine Telefonnummer ein"),
    regex(/^(\+)([0-9\s]{6,22}\d)$/, "Bitte trage eine gültige Telefonnummer ein")
  )
});