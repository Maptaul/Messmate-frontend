import { CloudCheckIcon } from "lucide-react";
import type { Metadata } from "next";
import MessWizard from "@/components/modules/mess-wizard/mess-wizard";
import { getT } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("manager.wizard.metaTitle"),
    alternates: await alternates("/manager/messes/new"),
  };
}

export default async function page() {
  const t = await getT();

  return (
    <section className="page-frame mx-auto max-w-192">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="page-title">{t("manager.wizard.title")}</h1>
          <p className="text-muted-foreground">
            {t("manager.wizard.description")}
          </p>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CloudCheckIcon className="size-3.5" />
          {t("manager.wizard.draftSaved")}
        </span>
      </div>
      <MessWizard />
    </section>
  );
}
