import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getT } from "@/i18n/get-dictionary";
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
  const t = await getT();

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">
            {t("marketing.faq.title")}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t("marketing.faq.lead")}
          </p>
        </div>
        <Accordion defaultValue={["q1"]}>
          {QUESTIONS.map((key) => (
            <AccordionItem key={key} value={key}>
              <AccordionTrigger className="text-base">
                {t(`marketing.faq.${key}.q`)}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {t(`marketing.faq.${key}.a`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
