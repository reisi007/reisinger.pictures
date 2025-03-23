import { email, nonEmpty, object, pipe, regex, string, union } from "valibot";

const LoginSecondStep = object({
  email: pipe(
    string(),
    nonEmpty("Bitte trag deine E-Mail Adresse ein"),
    email("Die E-Mail Adresse scheint nicht valide zu sein")
  ),
  otp: pipe(
    string(),
    nonEmpty("Bitte gib einen OTP ein")
  )
});
export const LoginSchema = union([
  LoginSecondStep,
  object({
    email: pipe(
      string(),
      nonEmpty("Bitte trag deine E-Mail Adresse ein"),
      email("Die E-Mail Adresse scheint nicht valide zu sein")
    )
  })
]);

const RegisterFirstStep = object({
  email: pipe(
    string(),
    nonEmpty("Bitte trag deine E-Mail Adresse ein"),
    email("Die E-Mail Adresse scheint nicht valide zu sein")
  ),
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
export const RegisterSchema = union([
  RegisterFirstStep,
  LoginSecondStep
]);