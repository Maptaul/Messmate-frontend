import type { Metadata } from "next";
import ContactForm from "@/components/form/contact-form";
import { getT } from "@/i18n/get-dictionary";
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
  const t = await getT();

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">
            {t("marketing.contact.title")}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t("marketing.contact.lead")}
          </p>
        </div>
        <ContactForm to={CONTACT_EMAIL} />
        <p className="mt-8 text-sm text-muted-foreground">
          {t("marketing.contact.direct")}{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </section>
  );
}
