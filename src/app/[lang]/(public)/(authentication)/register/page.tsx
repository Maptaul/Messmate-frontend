import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/assets/svg/Logo";
import RegisterForm from "@/components/form/register-form";
import AuthAside from "@/components/modules/auth/auth-aside";
import LanguageSwitcher from "@/components/ui/language-switcher";
import ThemeToggle from "@/components/ui/theme-toggle";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";
import { alternates } from "@/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("auth.register.metaTitle"),
    description: t("auth.register.metaDescription"),
    alternates: await alternates("/register"),
  };
}

export default async function RegisterPage() {
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
            <RegisterForm />
          </div>
        </div>
      </div>
      <AuthAside />
    </div>
  );
}
