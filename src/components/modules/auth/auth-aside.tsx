import {
  CalendarCheck2Icon,
  ReceiptTextIcon,
  WalletCardsIcon,
} from "lucide-react";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";

export default async function AuthLayout({ children }: LayoutProps<"/[lang]">) {
  const [t, locale] = await Promise.all([getT(), getLocale()]);

  const points = [
    {
      icon: CalendarCheck2Icon,
      title: t("auth.layout.planTitle"),
      body: t("auth.layout.planBody"),
    },
    {
      icon: ReceiptTextIcon,
      title: t("auth.layout.ledgerTitle"),
      body: t("auth.layout.ledgerBody"),
    },
    {
      icon: WalletCardsIcon,
      title: t("auth.layout.billTitle"),
      body: t("auth.layout.billBody"),
    },
  ];

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-8 p-6 md:p-10">
        <div className="flex items-center justify-between gap-4">
          <Logo href={localePath(locale, "/")} />
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
        <main className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </main>
      </div>

      <aside className="relative hidden flex-col justify-center gap-10 overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <div
          aria-hidden
          className="absolute -top-24 -right-24 size-96 rounded-full bg-primary-foreground/10 blur-3xl"
        />
        <div className="relative space-y-3">
          <p className="text-sm font-medium opacity-80">
            {t("auth.layout.eyebrow")}
          </p>
          <h2 className="max-w-md text-4xl leading-tight font-semibold text-balance">
            {t("auth.layout.title")}
          </h2>
        </div>
        <ul className="relative space-y-6">
          {points.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/15">
                <Icon className="size-5" aria-hidden />
              </span>
              <div>
                <p className="font-medium">{title}</p>
                <p className="text-sm opacity-80">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
