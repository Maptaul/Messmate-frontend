import {
  ArrowRightIcon,
  CheckIcon,
  ShieldIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";
import { pageMetadata } from "@/i18n/metadata";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return pageMetadata({
    title: t("marketing.features.metaTitle"),
    description: t("marketing.features.metaDescription"),
    path: "/features",
  });
}

const GROUPS = [
  {
    key: "manager",
    icon: UsersIcon,
    tone: "tone-b",
    items: ["i1", "i2", "i3", "i4", "i5", "i6"],
  },
  {
    key: "member",
    icon: UserIcon,
    tone: "tone-g",
    items: ["i1", "i2", "i3", "i4", "i5"],
  },
  {
    key: "admin",
    icon: ShieldIcon,
    tone: "tone-v",
    items: ["i1", "i2", "i3", "i4"],
  },
] as const;

export default async function FeaturesPage() {
  const [t, locale] = await Promise.all([getT(), getLocale()]);

  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-7 px-4 py-12 sm:px-6 md:py-20">
      <div className="flex flex-col gap-2.5">
        <h1 className="text-[34px] leading-tight font-bold tracking-tight md:text-[46px]">
          {t("marketing.features.title")}
        </h1>
        <p className="text-lg text-foreground-2">
          {t("marketing.features.lead")}
        </p>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-3">
        {GROUPS.map(({ key, icon: Icon, tone, items }) => (
          <div
            key={key}
            className="flex flex-col gap-4 rounded-xl border bg-card p-5.5 shadow-1"
          >
            <h2 className="flex items-center gap-2.5 text-[17px] font-semibold">
              <span
                className={cn(
                  tone,
                  "grid size-10 place-items-center rounded-lg",
                )}
              >
                <Icon className="size-4.5" aria-hidden />
              </span>
              {t(`marketing.features.${key}.title`)}
            </h2>
            <ul className="flex flex-col gap-2.5">
              {items.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 text-[14.5px] leading-normal text-foreground-2"
                >
                  <CheckIcon
                    className="mt-1 size-4 shrink-0 text-(--tone-g-fg)"
                    aria-hidden
                  />
                  <span>{t.dynamic(`marketing.features.${key}.${item}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Button
        size="lg"
        className="h-11 w-fit px-5"
        render={<Link href={localePath(locale, "/register")} />}
        nativeButton={false}
      >
        {t("marketing.features.cta")}
        <ArrowRightIcon />
      </Button>
    </section>
  );
}
