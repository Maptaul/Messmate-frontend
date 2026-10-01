import type { Metadata } from "next";
import { redirect } from "next/navigation";
import VerifyAccountForm from "@/components/form/verify-account-form";
import AuthShell from "@/components/modules/auth/auth-shell";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("auth.verify.metaTitle"),
    description: t("auth.verify.metaDescription"),
    robots: { index: false },
  };
}

export default async function VerifyAccountPage({
  searchParams,
}: PageProps<"/[lang]/register/verify-account">) {
  const [{ email }, locale] = await Promise.all([searchParams, getLocale()]);
  if (typeof email !== "string" || !email) {
    redirect(localePath(locale, "/register"));
  }

  return (
    <AuthShell>
      <VerifyAccountForm email={email} />
    </AuthShell>
  );
}
