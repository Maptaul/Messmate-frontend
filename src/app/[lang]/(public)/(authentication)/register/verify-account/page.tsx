import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { VerifyEmailForm } from "@/components/modules/auth/verify-email-form";
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

export default async function VerifyEmailPage({
  searchParams,
}: PageProps<"/[lang]/verify-email">) {
  const { email } = await searchParams;
  if (typeof email !== "string" || !email) {
    redirect(localePath(await getLocale(), "/register"));
  }

  return <VerifyEmailForm email={email} />;
}
