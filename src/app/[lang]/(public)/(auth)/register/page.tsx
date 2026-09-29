import type { Metadata } from "next";
import { RegisterForm } from "@/components/modules/auth/register-form";
import { getT } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("auth.register.metaTitle"),
    description: t("auth.register.metaDescription"),
    alternates: await alternates("/register"),
  };
}

export default function RegisterPage() {
  return <RegisterForm />;
}
