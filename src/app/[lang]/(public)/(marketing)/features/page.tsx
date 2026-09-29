import { CheckIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";
import { pageMetadata } from "@/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return pageMetadata({
    title: t("marketing.features.metaTitle"),
    description: t("marketing.features.metaDescription"),
    path: "/features",
  });
}

const GROUPS = [
  { key: "manager", items: ["i1", "i2", "i3", "i4", "i5", "i6"] },
  { key: "member", items: ["i1", "i2", "i3", "i4", "i5"] },
  { key: "admin", items: ["i1", "i2", "i3", "i4"] },
] as const;

export default async function FeaturesPage() {
  const [t, locale] = await Promise.all([getT(), getLocale()]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
      <div className="mb-10 max-w-2xl space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">
          {t("marketing.features.title")}
        </h1>
        <p className="text-lg text-muted-foreground">
          {t("marketing.features.lead")}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {GROUPS.map((group) => (
          <Card key={group.key}>
            <CardHeader>
              <CardTitle>
                <h2>{t(`marketing.features.${group.key}.title`)}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckIcon
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden
                    />
                    <span>
                      {t.dynamic(`marketing.features.${group.key}.${item}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button
          size="lg"
          render={<Link href={localePath(locale, "/register")} />}
          nativeButton={false}
        >
          {t("marketing.features.cta")}
        </Button>
      </div>
    </section>
  );
}
