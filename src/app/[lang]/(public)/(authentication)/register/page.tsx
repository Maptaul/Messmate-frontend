import type { Metadata } from "next";
import RegisterForm from "@/components/form/register-form";
import AuthShell from "@/components/modules/auth/auth-shell";
import { getT } from "@/i18n/get-dictionary";
import { pageMetadata } from "@/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return pageMetadata({
    title: t("auth.register.metaTitle"),
    description: t("auth.register.metaDescription"),
    path: "/register",
  });
}

export default async function RegisterPage() {
  return (
    <AuthShell>
      <RegisterForm />
    </AuthShell>
  );
}
