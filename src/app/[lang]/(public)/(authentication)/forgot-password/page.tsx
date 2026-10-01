import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/form/forgot-password-form";
import AuthShell from "@/components/modules/auth/auth-shell";
import { getT } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("auth.forgot.metaTitle"),
    description: t("auth.forgot.metaDescription"),
    alternates: await alternates("/forgot-password"),
  };
}

export default async function ForgotPasswordPage() {
  return (
    <AuthShell>
      <ForgotPasswordForm />
    </AuthShell>
  );
}
