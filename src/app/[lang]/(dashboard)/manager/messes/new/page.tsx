import { CloudCheckIcon } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import MessWizard from "@/components/modules/mess-wizard/mess-wizard";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";
import { alternates } from "@/i18n/metadata";
import { getActiveMess, getMeOnServer } from "@/lib/activeMess";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("manager.wizard.metaTitle"),
    alternates: await alternates("/manager/messes/new"),
  };
}

export default async function page() {
  const [t, locale, { choices }, me] = await Promise.all([
    getT(),
    getLocale(),
    getActiveMess(),
    getMeOnServer(),
  ]);

  // A manager runs one mess; the API refuses a second one too.
  if (choices.length > 0) redirect(localePath(locale, "/manager"));

  // Start from the mess the admin approved, if that's how they got here.
  const request = me?.data.managerApplications?.[0];
  const prefill =
    request?.status === "APPROVED"
      ? { name: request.messName, address: request.messAddress }
      : undefined;

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
      <MessWizard prefill={prefill} />
    </section>
  );
}
