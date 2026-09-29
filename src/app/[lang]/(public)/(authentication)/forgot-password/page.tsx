import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/modules/auth/forgot-password-form";
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

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
