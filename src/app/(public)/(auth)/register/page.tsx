import type { Metadata } from "next";
import { RegisterForm } from "@/components/modules/auth/register-form";

export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Join your mess on MessMate as a member, or start one as its manager.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
