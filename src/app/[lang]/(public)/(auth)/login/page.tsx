import type { Metadata } from "next";
import { LoginForm } from "@/components/modules/auth/login-form";
import { getT } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("auth.login.metaTitle"),
    description: t("auth.login.metaDescription"),
    alternates: await alternates("/login"),
  };
}

export default async function LoginPage({
  searchParams,
}: PageProps<"/[lang]/login">) {
  const { redirect, email } = await searchParams;

  return (
    <LoginForm
      redirect={typeof redirect === "string" ? redirect : undefined}
      initialEmail={typeof email === "string" ? email : ""}
    />
  );
}
