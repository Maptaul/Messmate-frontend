import { EyeIcon, ScaleIcon, SplitIcon, UtensilsIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";
import { pageMetadata } from "@/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return pageMetadata({
    title: t("marketing.about.metaTitle"),
    description: t("marketing.about.metaDescription"),
    path: "/about-us",
  });
}

const PRINCIPLES = [
  { key: "q1", icon: EyeIcon },
  { key: "q2", icon: UtensilsIcon },
  { key: "q3", icon: SplitIcon },
  { key: "q4", icon: ScaleIcon },
] as const;

export default async function AboutPage() {
  const [t, locale] = await Promise.all([getT(), getLocale()]);

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl font-semibold tracking-tight text-balance">
            {t("marketing.about.title")}
          </h1>
          <p className="text-xl text-muted-foreground text-balance">
            {t("marketing.about.lead")}
          </p>
          <p>{t("marketing.about.p1")}</p>
          <p>{t("marketing.about.p2")}</p>
        </div>
      </section>

      <section className="border-y bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <div className="mb-10 max-w-2xl space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight text-balance">
              {t("marketing.about.principlesTitle")}
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {PRINCIPLES.map(({ key, icon: Icon }) => (
              <Card key={key}>
                <CardContent className="flex items-start gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div className="space-y-1">
                    <h2 className="font-medium">
                      {t(`marketing.about.${key}.title`)}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {t(`marketing.about.${key}.body`)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 text-center">
        <Button
          size="lg"
          render={<Link href={localePath(locale, "/features")} />}
          nativeButton={false}
        >
          {t("marketing.about.cta")}
        </Button>
      </section>
    </>
  );
}
