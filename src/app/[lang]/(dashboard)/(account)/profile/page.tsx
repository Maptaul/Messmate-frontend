import type { Metadata } from "next";
import Profile from "@/components/modules/profile/profile";
import { getT } from "@/i18n/get-dictionary";
import { alternates } from "@/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("profile.metaTitle"),
    alternates: await alternates("/profile"),
  };
}

export default async function page() {
  const t = await getT();

  return (
    <section className="space-y-6 p-5">
      <div>
        <h1 className="text-2xl font-semibold">{t("profile.title")}</h1>
        <p className="text-muted-foreground">{t("profile.description")}</p>
      </div>
      <Profile />
    </section>
  );
}
