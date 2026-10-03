"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "@/assets/svg/Logo";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/ui/language-switcher";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ThemeToggle from "@/components/ui/theme-toggle";
import { useLocalePath, useT } from "@/i18n/i18n-provider";
import { splitLocale } from "@/i18n/locale-path";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", key: "home" },
  { href: "/features", key: "features" },
  { href: "/about-us", key: "about" },
  { href: "/faq", key: "faq" },
  { href: "/contact", key: "contact" },
] as const;

export default function Header({
  dashboardHref,
}: {
  dashboardHref: string | null;
}) {
  const t = useT();
  const href = useLocalePath();
  const { path } = splitLocale(usePathname());
  const [open, setOpen] = useState(false);

  const account = dashboardHref ? (
    <Button
      size="sm"
      render={<Link href={dashboardHref} />}
      nativeButton={false}
    >
      {t("marketing.nav.dashboard")}
    </Button>
  ) : (
    <>
      <Button
        variant="ghost"
        size="sm"
        render={<Link href={href("/login")} />}
        nativeButton={false}
      >
        {t("marketing.nav.login")}
      </Button>
      <Button
        size="sm"
        render={<Link href={href("/register")} />}
        nativeButton={false}
      >
        {t("marketing.nav.register")}
      </Button>
    </>
  );

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          href={href("/")}
          className="flex items-center gap-2 font-semibold"
        >
          <Logo />
          <span className="text-lg tracking-tight">MessMate</span>
        </Link>

        <nav
          aria-label={t("marketing.nav.main")}
          className="ml-6 hidden items-center gap-1 md:flex"
        >
          {LINKS.map(({ href: to, key }) => (
            <Link
              key={key}
              href={href(to)}
              aria-current={path === to ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
                path === to && "bg-muted font-medium text-foreground",
              )}
            >
              {t(`marketing.nav.${key}`)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
          <div className="ml-2 hidden items-center gap-1 sm:flex">
            {account}
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label={t("marketing.nav.menu")}
                />
              }
            >
              <MenuIcon />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>{t("marketing.nav.menu")}</SheetTitle>
              </SheetHeader>
              <nav
                aria-label={t("marketing.nav.main")}
                className="flex flex-col gap-1 px-4"
              >
                {LINKS.map(({ href: to, key }) => (
                  <Link
                    key={key}
                    href={href(to)}
                    onClick={() => setOpen(false)}
                    aria-current={path === to ? "page" : undefined}
                    className={cn(
                      "rounded-md px-3 py-2 text-base",
                      path === to
                        ? "bg-muted font-medium"
                        : "text-muted-foreground",
                    )}
                  >
                    {t(`marketing.nav.${key}`)}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2 p-4 sm:hidden">
                {account}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
