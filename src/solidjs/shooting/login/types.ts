export type LoginForm = { email: string, otp?: string }
export type RegisterForm = LoginForm & { firstName: string, lastName: string, tel: string }