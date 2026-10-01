import type { Metadata } from "next";
import FaqList from "@/components/modules/homepage/faq-list";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";
import { pageMetadata } from "@/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return pageMetadata({
    title: t("marketing.faq.metaTitle"),
    description: t("marketing.faq.metaDescription"),
    path: "/faq",
  });
}

const QUESTIONS = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"] as const;

export default async function FaqPage() {
  const [t, locale] = await Promise.all([getT(), getLocale()]);

  return (
    <section className="mx-auto flex max-w-190 flex-col gap-5 px-4 py-12 sm:px-6 md:py-20">
      <h1 className="text-[34px] leading-tight font-bold tracking-tight md:text-[46px]">
        {t("marketing.faq.title")}
      </h1>
      <FaqList
        contactHref={localePath(locale, "/contact")}
        questions={QUESTIONS.map((key) => ({
          key,
          q: t(`marketing.faq.${key}.q`),
          a: t(`marketing.faq.${key}.a`),
        }))}
      />
    </section>
  );
}
