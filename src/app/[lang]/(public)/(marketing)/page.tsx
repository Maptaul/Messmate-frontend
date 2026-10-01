import {
  ArrowRightIcon,
  BookOpenIcon,
  CalendarCheckIcon,
  CalendarDaysIcon,
  CalendarPlusIcon,
  CreditCardIcon,
  LanguagesIcon,
  ShieldIcon,
  ShoppingBasketIcon,
  ShoppingCartIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import BillEstimator from "@/components/modules/homepage/bill-estimator";
import CtaBand from "@/components/modules/homepage/cta-band";
import Hero from "@/components/modules/homepage/Hero";
import { Button } from "@/components/ui/button";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";
import { pageMetadata } from "@/i18n/metadata";
import { getSessionUser } from "@/lib/session";
import { formatNumber } from "@/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return pageMetadata({
    title: t("marketing.home.metaTitle"),
    description: t("marketing.home.metaDescription"),
    path: "/",
  });
}

const FEATURES = [
  { key: "f1", icon: CalendarDaysIcon },
  { key: "f2", icon: BookOpenIcon },
  { key: "f3", icon: ShoppingCartIcon },
  { key: "f4", icon: CalendarCheckIcon },
  { key: "f5", icon: CreditCardIcon },
  { key: "f6", icon: LanguagesIcon },
] as const;

const STEPS = [
  { key: "s1", icon: CalendarPlusIcon, tone: "tone-g" },
  { key: "s2", icon: ShoppingBasketIcon, tone: "tone-b" },
  { key: "s3", icon: CalendarCheckIcon, tone: "tone-n" },
] as const;

const ROLES = [
  { key: "r1", icon: UsersIcon, tone: "tone-b" },
  { key: "r2", icon: UserIcon, tone: "tone-g" },
  { key: "r3", icon: ShieldIcon, tone: "tone-v" },
] as const;

const CHIPS = ["c1", "c2", "c3", "c4", "c5", "c6"] as const;

export default async function HomePage() {
  const [t, locale, user] = await Promise.all([
    getT(),
    getLocale(),
    getSessionUser(),
  ]);
  const href = (path: string) => localePath(locale, path);
  const h2 =
    "text-[26px] font-semibold tracking-tight text-balance md:text-[32px]";

  return (
    <>
      <Hero />

      <section className="border-y bg-muted/50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
          <div className="mb-8 flex flex-col gap-2">
            <h2 className={h2}>{t("marketing.home.featuresTitle")}</h2>
            <p className="text-foreground-2">
              {t("marketing.home.featuresBody")}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ key, icon: Icon }) => (
              <div
                key={key}
                className="flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-1"
              >
                <span className="grid size-9 place-items-center rounded-lg bg-primary-tint text-primary">
                  <Icon className="size-4.5" aria-hidden />
                </span>
                <h3 className="font-semibold">
                  {t(`marketing.home.${key}.title`)}
                </h3>
                <p className="text-[13.5px] text-muted-foreground">
                  {t(`marketing.home.${key}.body`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
        <h2 className={`${h2} mb-8`}>{t("marketing.home.stepsTitle")}</h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {STEPS.map(({ key, icon: Icon, tone }, index) => (
            <li
              key={key}
              className="flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-1"
            >
              <span className="grid size-8 place-items-center rounded-full bg-primary font-semibold text-primary-foreground">
                {formatNumber(index + 1, locale)}
              </span>
              <h3 className="font-semibold">
                {t(`marketing.home.${key}.title`)}
              </h3>
              <p className="text-[13.5px] text-muted-foreground">
                {t(`marketing.home.${key}.body`)}
              </p>
              <span className="mt-auto flex items-center gap-2 rounded-lg border bg-muted/60 px-3 py-2 text-[13px]">
                <Icon className="size-4 text-muted-foreground" aria-hidden />
                <span className="flex-1 font-medium">
                  {t(`marketing.home.${key}.chip`)}
                </span>
                <span
                  className={`${tone} rounded-full border px-2 py-0.5 text-[11px] font-medium`}
                >
                  {t(`marketing.home.${key}.tag`)}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y bg-muted/50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
          <h2 className={`${h2} mb-8`}>{t("marketing.home.rolesTitle")}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {ROLES.map(({ key, icon: Icon, tone }) => (
              <div
                key={key}
                className="flex items-start gap-3.5 rounded-xl border bg-card p-5 shadow-1"
              >
                <span
                  className={`${tone} grid size-10 shrink-0 place-items-center rounded-xl`}
                >
                  <Icon className="size-5" aria-hidden />
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold">
                    {t(`marketing.home.${key}.title`)}
                  </h3>
                  <p className="text-[13.5px] text-muted-foreground">
                    {t(`marketing.home.${key}.body`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-12 sm:px-6 md:py-20 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <p className="micro text-primary">
            {t("marketing.home.math.eyebrow")}
          </p>
          <h2 className={h2}>{t("marketing.home.math.title")}</h2>
          <p className="max-w-lg text-foreground-2">
            {t("marketing.home.math.body")}
          </p>
          <ul className="flex flex-wrap gap-2">
            {CHIPS.map((chip) => (
              <li
                key={chip}
                className="rounded-lg border bg-card px-3 py-1.5 font-mono text-[13px]"
              >
                {t(`marketing.home.math.chips.${chip}`)}
              </li>
            ))}
          </ul>
        </div>
        <BillEstimator />
      </section>

      <CtaBand />

      {!user && (
        <>
          {/* Phones keep the two calls to action in reach while scrolling. */}
          <div aria-hidden className="h-18 md:hidden" />
          <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-[1fr_1.4fr] gap-2 border-t bg-background/90 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
            <Button
              size="lg"
              variant="outline"
              className="h-11"
              render={<Link href={href("/login")} />}
              nativeButton={false}
            >
              {t("marketing.home.ctaSecondary")}
            </Button>
            <Button
              size="lg"
              className="h-11"
              render={<Link href={href("/register")} />}
              nativeButton={false}
            >
              {t("marketing.home.ctaPrimary")}
              <ArrowRightIcon />
            </Button>
          </div>
        </>
      )}
    </>
  );
}
