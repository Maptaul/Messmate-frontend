import { z } from "zod";

const email = z.string().trim().pipe(z.email("Enter a valid email address"));

/** The backend's rule, so the form never lets through what the API rejects. */
export const passwordRule = z
  .string()
  .min(8, "Use at least 8 characters")
  .regex(/[a-z]/, "Add a lowercase letter")
  .regex(/[A-Z]/, "Add an uppercase letter")
  .regex(/[0-9]/, "Add a number")
  .regex(/[^A-Za-z0-9]/, "Add a symbol, like @ or #");

const otp = z
  .string()
  .regex(/^\d{6}$/, "Enter the 6-digit code from the email");

// Login only checks presence: an old password that predates the rule should
// still reach the server and get an honest "invalid credentials".
export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(120, "Name is too long"),
    email,
    phone: z
      .string()
      .trim()
      .max(20, "Phone number is too long")
      .refine((value) => value === "" || /^[0-9+\-\s]{6,20}$/.test(value), {
        message: "Enter a valid phone number",
      }),
    role: z.enum(["MEMBER", "MESS_MANAGER"], {
      message: "Choose how you'll use MessMate",
    }),
    password: passwordRule,
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const verifyEmailSchema = z.object({ otp });

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({
    otp,
    newPassword: passwordRule,
    confirmPassword: z.string(),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
