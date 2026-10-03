import Link from "next/link";
import type { ReactNode } from "react";
import Logo from "@/assets/svg/Logo";
import LanguageSwitcher from "@/components/ui/language-switcher";
import ThemeToggle from "@/components/ui/theme-toggle";
import { getLocale } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";
import { cn } from "@/lib/utils";
import AuthAside from "./auth-aside";

export default async function AuthShell({
  children,
  wide = false,
}: {
  children: ReactNode;
  /** The login page's demo cards need more room than a plain form. */
  wide?: boolean;
}) {
  const locale = await getLocale();

  return (
    // On desktop the page is one screen tall: the brand panel stays put and
    // only the form column scrolls when the form is taller than the window.
    <div className="grid min-h-svh bg-background lg:h-svh lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="flex min-h-svh flex-col lg:min-h-0 lg:overflow-y-auto">
        <div className="flex h-16 shrink-0 items-center gap-2.5 px-4 md:px-8">
          <Link
            href={localePath(locale, "/")}
            className="flex items-center gap-2 font-semibold"
          >
            <Logo />
            <span>MessMate</span>
          </Link>
          <div className="flex-1" />
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
        <div className="flex flex-1 justify-center px-4 pt-6 pb-12 md:px-8 lg:pt-2 lg:pb-8">
          <div
            className={cn(
              "flex w-full flex-col gap-4.5 self-center",
              wide ? "max-w-135" : "max-w-110",
            )}
          >
            {children}
          </div>
        </div>
      </div>
      <AuthAside />
    </div>
  );
}
