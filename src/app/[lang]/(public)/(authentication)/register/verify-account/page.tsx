import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Logo from "@/assets/svg/Logo";
import AuthAside from "@/components/modules/auth/auth-aside";
import LanguageSwitcher from "@/components/ui/language-switcher";
import ThemeToggle from "@/components/ui/theme-toggle";
import VerifyAccountForm from "@/components/form/verify-account-form";
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
            <VerifyAccountForm email={email} />
          </div>
        </div>
      </div>
      <AuthAside />
    </div>
  );
}
