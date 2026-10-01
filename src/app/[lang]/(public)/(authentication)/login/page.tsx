import type { Metadata } from "next";
import LoginForm from "@/components/form/login-form";
import AuthShell from "@/components/modules/auth/auth-shell";
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
    <AuthShell wide>
      <LoginForm
        redirect={typeof redirect === "string" ? redirect : undefined}
        initialEmail={typeof email === "string" ? email : ""}
      />
    </AuthShell>
  );
}
