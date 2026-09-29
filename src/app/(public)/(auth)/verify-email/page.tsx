import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { VerifyEmailForm } from "@/components/modules/auth/verify-email-form";

export const metadata: Metadata = {
  title: "Verify your email",
  description: "Enter the 6-digit code we emailed you to finish signing up.",
};

export default async function VerifyEmailPage({
  searchParams,
}: PageProps<"/verify-email">) {
  const { email } = await searchParams;
  if (typeof email !== "string" || !email) redirect("/register");

  return <VerifyEmailForm email={email} />;
}
