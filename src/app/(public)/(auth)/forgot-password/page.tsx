import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/modules/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset your password",
  description: "Get a reset code by email and choose a new MessMate password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
