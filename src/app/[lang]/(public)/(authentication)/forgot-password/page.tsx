import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/form/forgot-password-form";
import AuthShell from "@/components/modules/auth/auth-shell";
import { getT } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return pageMetadata({
    title: t("auth.forgot.metaTitle"),
    description: t("auth.forgot.metaDescription"),
    path: "/forgot-password",
  });
}

export default async function ForgotPasswordPage() {
  return (
    <AuthShell>
      <ForgotPasswordForm />
    </AuthShell>
  );
}
