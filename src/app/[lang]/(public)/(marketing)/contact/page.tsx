import { ArrowRightIcon, ClockIcon, MailIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/form/contact-form";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";
import { pageMetadata } from "@/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return pageMetadata({
    title: t("marketing.contact.metaTitle"),
    description: t("marketing.contact.metaDescription"),
    path: "/contact",
  });
}

// Set NEXT_PUBLIC_CONTACT_EMAIL to the inbox that should receive messages.
const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@messmate.app";

export default async function ContactPage() {
  const [t, locale] = await Promise.all([getT(), getLocale()]);

  return (
    <section className="mx-auto flex max-w-275 flex-col gap-6 px-4 py-12 sm:px-6 md:py-20">
      <div className="flex max-w-160 flex-col gap-2.5">
        <h1 className="text-[34px] leading-tight font-bold tracking-tight md:text-[46px]">
          {t("marketing.contact.title")}
        </h1>
        <p className="text-[17px] leading-relaxed text-foreground-2">
          {t("marketing.contact.lead")}
        </p>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border bg-card p-6">
          <ContactForm to={CONTACT_EMAIL} />
        </div>
        <div className="flex flex-col gap-3 rounded-xl border bg-card p-5">
          <p className="font-semibold">{t("marketing.contact.direct")}</p>
          <a
            href={"mailto:" + CONTACT_EMAIL}
            className="flex items-center gap-2.5 font-medium text-primary hover:underline"
          >
            <MailIcon className="size-4" />
            {CONTACT_EMAIL}
          </a>
          <p className="flex items-center gap-2.5 text-foreground-2">
            <ClockIcon className="size-4 text-muted-foreground" />
            {t("marketing.contact.replyTime")}
          </p>
          <div className="h-px bg-border" />
          <Link
            href={localePath(locale, "/faq")}
            className="flex w-fit items-center gap-1.5 text-sm text-primary hover:underline"
          >
            {t("marketing.contact.readFaq")}
            <ArrowRightIcon className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
