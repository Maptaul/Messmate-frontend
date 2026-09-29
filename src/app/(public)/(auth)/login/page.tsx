import type { Metadata } from "next";
import { LoginForm } from "@/components/modules/auth/login-form";

export const metadata: Metadata = {
  title: "Log in",
  description:
    "Log in to MessMate, or try the admin, mess manager or member demo in one click.",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { redirect, email } = await searchParams;

  return (
    <LoginForm
      redirect={typeof redirect === "string" ? redirect : undefined}
      initialEmail={typeof email === "string" ? email : ""}
    />
  );
}
