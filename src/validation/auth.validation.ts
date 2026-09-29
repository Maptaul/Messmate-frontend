import z from "zod";

// Messages are dictionary keys; the field components translate them.

const email = z.string().trim().pipe(z.email("validation.emailInvalid"));

/** The backend's rule, so the form never lets through what the API rejects. */
export const passwordRule = z
  .string()
  .min(8, "validation.passwordMin")
  .regex(/[a-z]/, "validation.passwordLower")
  .regex(/[A-Z]/, "validation.passwordUpper")
  .regex(/[0-9]/, "validation.passwordNumber")
  .regex(/[^A-Za-z0-9]/, "validation.passwordSymbol");

const otp = z.string().regex(/^\d{6}$/, "validation.otpInvalid");

// Login only checks presence: an old password that predates the rule should
// still reach the server and get an honest "invalid credentials".
export const loginSchema = z.object({
  email,
  password: z.string().min(1, "validation.passwordRequired"),
});

export const registrationSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "validation.nameMin")
      .max(120, "validation.nameMax"),
    email,
    phone: z
      .string()
      .trim()
      .max(20, "validation.phoneMax")
      .refine((value) => value === "" || /^[0-9+\-\s]{6,20}$/.test(value), {
        message: "validation.phoneInvalid",
      }),
    role: z.enum(["MEMBER", "MESS_MANAGER"], {
      message: "validation.roleRequired",
    }),
    password: passwordRule,
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "validation.passwordsMismatch",
    path: ["confirmPassword"],
  });

export const verifyAccountSchema = z.object({ otp });

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({
    otp,
    newPassword: passwordRule,
    confirmPassword: z.string(),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "validation.passwordsMismatch",
    path: ["confirmPassword"],
  });
