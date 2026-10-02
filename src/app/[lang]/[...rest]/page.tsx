import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getT } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("notFound.metaTitle"), robots: { index: false } };
}

// Every unknown URL lands inside [lang] (the proxy rewrites English paths to
// /en/...), so this catch-all hands them to [lang]/not-found.tsx — rendered in
// the visitor's language and theme.
export default function UnknownPage() {
  notFound();
}
