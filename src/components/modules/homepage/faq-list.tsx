"use client";

import { ArrowRightIcon, SearchIcon, SearchXIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { formatNumber } from "@/utils";

export default function FaqList({
  questions,
  contactHref,
}: {
  questions: { key: string; q: string; a: string }[];
  contactHref: string;
}) {
  const t = useT();
  const locale = useLocale();
  const [query, setQuery] = useState("");

  const needle = query.trim().toLowerCase();
  const shown = needle
    ? questions.filter((item) =>
        `${item.q} ${item.a}`.toLowerCase().includes(needle),
      )
    : questions;

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex h-11.5 items-center gap-2 rounded-xl border bg-card pr-2 pl-3.5 focus-within:ring-2 focus-within:ring-ring/50">
          <SearchIcon className="size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("marketing.faq.search")}
            aria-label={t("marketing.faq.search")}
            className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none"
          />
          {needle && (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={t("marketing.faq.clear")}
              onClick={() => setQuery("")}
            >
              <XIcon />
            </Button>
          )}
        </div>
        {needle && (
          <output className="text-[13px] text-muted-foreground">
            {shown.length === 1
              ? t("marketing.faq.matchOne")
              : t("marketing.faq.matches", {
                  count: formatNumber(shown.length, locale),
                })}
          </output>
        )}
      </div>

      {shown.length === 0 ? (
        <div className="flex flex-col items-center gap-2.5 rounded-xl border border-dashed border-border-strong px-5 py-7 text-center">
          <SearchXIcon className="size-6 text-muted-foreground" />
          <p className="text-foreground-2">{t("marketing.faq.none")}</p>
          <Link
            href={contactHref}
            className="flex items-center gap-1.5 font-medium text-primary hover:underline"
          >
            {t("marketing.contact.title")}
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      ) : (
        <Accordion
          defaultValue={[questions[0]?.key]}
          className="overflow-hidden rounded-xl border bg-card"
        >
          {shown.map((item) => (
            <AccordionItem
              key={item.key}
              value={item.key}
              className="border-b px-4.5 last:border-0"
            >
              <AccordionTrigger className="text-[15px]">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="leading-relaxed text-foreground-2">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </>
  );
}
