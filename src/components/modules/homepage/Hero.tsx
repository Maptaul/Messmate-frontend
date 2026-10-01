import {
  ArrowRightIcon,
  ChefHatIcon,
  ShieldIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import Logo from "@/assets/svg/Logo";
import { Button } from "@/components/ui/button";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";
import { formatBDT, formatNumber } from "@/utils";

// An illustration of the manager's overview, labelled "Example" on the card.
const EXAMPLE = {
  rate: 62.24,
  groceries: 19450,
  shared: 7400,
  spending: [
    ["RENT", 24000],
    ["GROCERY", 19450],
    ["MAID", 3000],
    ["ELECTRICITY", 1800],
    ["GAS", 1200],
  ] as const,
  lunch: 5.5,
  dinner: 6,
};

export default async function Hero() {
  const [t, locale] = await Promise.all([getT(), getLocale()]);
  const href = (path: string) => localePath(locale, path);
  const money = (value: number) => formatBDT(value, locale);
  const top = EXAMPLE.spending[0][1];

  const roles = [
    {
      icon: UsersIcon,
      label: t("marketing.home.r1.title"),
      tone: "text-(--tone-b-fg)",
    },
    {
      icon: UserIcon,
      label: t("marketing.home.r2.title"),
      tone: "text-(--tone-g-fg)",
    },
    {
      icon: ShieldIcon,
      label: t("marketing.home.r3.title"),
      tone: "text-(--tone-v-fg)",
    },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-12 pb-14 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:pt-22 lg:pb-24">
        <div className="flex flex-col items-start gap-6">
          <span className="tone-g flex h-7 items-center gap-2 rounded-full border px-3 text-[13px] font-medium">
            <span className="size-1.5 rounded-full bg-current" />
            {t("marketing.home.eyebrow")}
          </span>
          <h1 className="text-[38px] leading-[1.05] font-semibold tracking-tight text-balance sm:text-[50px] xl:text-[58px]">
            {t("marketing.home.title")}
          </h1>
          <p className="max-w-xl text-lg text-foreground-2">
            {t("marketing.home.body")}
          </p>
          <div className="flex w-full flex-wrap gap-3">
            <Button
              size="lg"
              className="h-11 flex-1 px-5 sm:flex-none"
              render={<Link href={href("/register")} />}
              nativeButton={false}
            >
              {t("marketing.home.ctaPrimary")}
              <ArrowRightIcon />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 flex-1 px-5 sm:flex-none"
              render={<Link href={href("/login")} />}
              nativeButton={false}
            >
              {t("marketing.home.ctaSecondary")}
            </Button>
          </div>
          <div className="flex flex-col gap-2.5">
            <p className="text-[13px] text-muted-foreground">
              {t("marketing.home.ctaDemoNote")}
            </p>
            <div className="flex flex-wrap gap-2">
              {roles.map(({ icon: Icon, label, tone }) => (
                <Link
                  key={label}
                  href={href("/login")}
                  className="flex h-7 items-center gap-1.5 rounded-full border bg-card px-3 text-xs font-medium hover:bg-accent"
                >
                  <Icon className={`size-3.5 ${tone}`} />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <figure
          aria-label={t("marketing.home.preview.label")}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div
            aria-hidden
            className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl border bg-card/60"
          />
          <div className="relative flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-3">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-[13px] font-semibold">
                <Logo className="size-5" />
                {t("marketing.home.preview.mess")}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="rounded-full border px-2 py-0.5 text-[10.5px] font-medium text-muted-foreground">
                  {t("marketing.home.preview.example")}
                </span>
                <span className="tone-g rounded-full border px-2 py-0.5 text-[11px] font-medium">
                  {t("marketing.home.preview.cycle")}
                </span>
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                [t("marketing.home.preview.rate"), money(EXAMPLE.rate)],
                [
                  t("marketing.home.preview.groceries"),
                  money(EXAMPLE.groceries),
                ],
                [t("marketing.home.preview.shared"), money(EXAMPLE.shared)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border px-3 py-2">
                  <p className="text-[11px] text-muted-foreground">{label}</p>
                  <p className="font-semibold tabular-nums">{value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border p-3">
              <p className="mb-2 text-xs font-semibold">
                {t("marketing.home.preview.spending")}
              </p>
              <ul className="flex flex-col gap-1.5">
                {EXAMPLE.spending.map(([type, amount]) => (
                  <li
                    key={type}
                    className="grid grid-cols-[64px_minmax(0,1fr)] items-center gap-2 text-[11px]"
                  >
                    <span className="truncate text-muted-foreground">
                      {t(`expenseTypes.${type}`)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span
                        className="h-2 rounded-r bg-primary"
                        style={{ width: `${(amount / top) * 70}%` }}
                      />
                      <span className="tabular-nums">{money(amount)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center gap-3 rounded-xl border p-3">
              <span className="grid size-8 place-items-center rounded-lg bg-muted">
                <ChefHatIcon className="size-4 text-muted-foreground" />
              </span>
              <div className="flex-1">
                <p className="text-xs font-semibold">
                  {t("marketing.home.preview.headcount")}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {t("marketing.home.preview.locks")}
                </p>
              </div>
              {[
                [t("marketing.home.preview.lunch"), EXAMPLE.lunch],
                [t("marketing.home.preview.dinner"), EXAMPLE.dinner],
              ].map(([label, value]) => (
                <div key={label} className="text-center">
                  <p className="text-lg leading-none font-bold tabular-nums">
                    {formatNumber(value as number, locale)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}
