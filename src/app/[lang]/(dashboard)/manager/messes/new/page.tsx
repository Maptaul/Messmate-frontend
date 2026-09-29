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
    <section className="space-y-6 p-5">
      <div>
        <h1 className="text-2xl font-semibold">{t("manager.wizard.title")}</h1>
        <p className="text-muted-foreground">
          {t("manager.wizard.description")}
        </p>
      </div>
      <MessWizard />
    </section>
  );
}
