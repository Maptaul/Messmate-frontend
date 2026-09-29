import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/assets/svg/Logo";
import AuthAside from "@/components/modules/auth/auth-aside";
import LanguageSwitcher from "@/components/ui/language-switcher";
import ThemeToggle from "@/components/ui/theme-toggle";
import ForgotPasswordForm from "@/components/form/forgot-password-form";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";
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
  const locale = await getLocale();

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex items-center justify-between gap-2">
          <Link
            href={localePath(locale, "/")}
            className="flex items-center gap-2 font-medium"
          >
            <Logo />
            <span>MessMate</span>
          </Link>
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
      <AuthAside />
    </div>
  );
}
