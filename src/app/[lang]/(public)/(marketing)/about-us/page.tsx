import {
  ArrowRightIcon,
  BookOpenIcon,
  EyeIcon,
  SplitIcon,
  UtensilsIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import CtaBand from "@/components/modules/homepage/cta-band";
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
  { key: "q1", icon: BookOpenIcon },
  { key: "q2", icon: UtensilsIcon },
  { key: "q3", icon: SplitIcon },
  { key: "q4", icon: EyeIcon },
] as const;

export default async function AboutPage() {
  const [t, locale] = await Promise.all([getT(), getLocale()]);

  return (
    <>
      <section className="mx-auto flex max-w-190 flex-col gap-4.5 px-4 py-12 sm:px-6 md:py-20">
        <h1 className="text-[34px] leading-tight font-bold tracking-tight md:text-[46px]">
          {t("marketing.about.title")}
        </h1>
        <p className="text-xl leading-normal font-medium text-pretty">
          {t("marketing.about.lead")}
        </p>
        <p className="leading-relaxed text-foreground-2">
          {t("marketing.about.p1")}
        </p>
        <p className="leading-relaxed text-foreground-2">
          {t("marketing.about.p2")}
        </p>
      </section>

      <section className="mx-auto flex max-w-6xl flex-col gap-5 px-4 pb-16 sm:px-6">
        <h2 className="text-[26px] font-bold tracking-tight md:text-[32px]">
          {t("marketing.about.principlesTitle")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {PRINCIPLES.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="flex flex-col gap-2.5 rounded-xl border bg-card p-5.5"
            >
              <span className="tone-g grid size-9 place-items-center rounded-lg">
                <Icon className="size-4.5" aria-hidden />
              </span>
              <h3 className="font-semibold">
                {t(`marketing.about.${key}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-foreground-2">
                {t(`marketing.about.${key}.body`)}
              </p>
            </div>
          ))}
        </div>
        <Link
          href={localePath(locale, "/features")}
          className="flex w-fit items-center gap-1.5 font-medium text-primary hover:underline"
        >
          {t("marketing.about.cta")}
          <ArrowRightIcon className="size-4" />
        </Link>
      </section>

      <CtaBand />
    </>
  );
}
