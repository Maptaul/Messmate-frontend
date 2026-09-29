import {
  BanknoteIcon,
  CalendarCheck2Icon,
  CalendarRangeIcon,
  ChefHatIcon,
  CreditCardIcon,
  LanguagesIcon,
  ReceiptTextIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  UserIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/modules/homepage/Hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";
import { pageMetadata } from "@/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return pageMetadata({
    title: t("marketing.home.metaTitle"),
    description: t("marketing.home.metaDescription"),
    path: "/",
  });
}

const FEATURES = [
  { key: "f1", icon: CalendarCheck2Icon },
  { key: "f2", icon: ReceiptTextIcon },
  { key: "f3", icon: ShoppingCartIcon },
  { key: "f4", icon: CalendarRangeIcon },
  { key: "f5", icon: CreditCardIcon },
  { key: "f6", icon: LanguagesIcon },
] as const;

const STEPS = ["s1", "s2", "s3"] as const;

const ROLES = [
  { key: "r1", icon: ChefHatIcon },
  { key: "r2", icon: UserIcon },
  { key: "r3", icon: ShieldCheckIcon },
] as const;

export default async function HomePage() {
  const [t, locale] = await Promise.all([getT(), getLocale()]);
  const href = (path: string) => localePath(locale, path);

  return (
    <>
      <Hero />

      <section className="border-y bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <div className="mb-10 max-w-2xl space-y-3 mx-auto text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-balance">
              {t("marketing.home.featuresTitle")}
            </h2>
            <p className="text-muted-foreground">
              {t("marketing.home.featuresBody")}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ key, icon: Icon }) => (
              <Card key={key}>
                <CardContent className="space-y-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="font-medium">
                    {t(`marketing.home.${key}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(`marketing.home.${key}.body`)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="mb-10 max-w-2xl space-y-3 mx-auto text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-balance">
            {t("marketing.home.stepsTitle")}
          </h2>
        </div>
        <ol className="grid gap-6 md:grid-cols-3">
          {STEPS.map((key, index) => (
            <li key={key} className="space-y-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {index + 1}
              </span>
              <h3 className="font-medium">
                {t(`marketing.home.${key}.title`)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t(`marketing.home.${key}.body`)}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <div className="mb-10 max-w-2xl space-y-3 mx-auto text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-balance">
              {t("marketing.home.rolesTitle")}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {ROLES.map(({ key, icon: Icon }) => (
              <Card key={key}>
                <CardContent className="flex items-start gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div className="space-y-1">
                    <h3 className="font-medium">
                      {t(`marketing.home.${key}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t(`marketing.home.${key}.body`)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 text-center">
        <BanknoteIcon
          className="mx-auto mb-4 size-8 text-primary"
          aria-hidden
        />
        <h2 className="text-3xl font-semibold tracking-tight text-balance">
          {t("marketing.home.ctaTitle")}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          {t("marketing.home.ctaBody")}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            size="lg"
            render={<Link href={href("/register")} />}
            nativeButton={false}
          >
            {t("marketing.home.ctaPrimary")}
          </Button>
          <Button
            size="lg"
            variant="outline"
            render={<Link href={href("/login")} />}
            nativeButton={false}
          >
            {t("marketing.home.ctaSecondary")}
          </Button>
        </div>
      </section>
    </>
  );
}
