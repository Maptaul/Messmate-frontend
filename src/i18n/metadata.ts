import type { Metadata } from "next";
import { LOCALES } from "./config";
import { getLocale } from "./get-dictionary";
import { localePath } from "./locale-path";

/** Canonical URL for this language + hreflang links to every language. */
export async function alternates(
  path: string,
): Promise<Metadata["alternates"]> {
  const locale = await getLocale();

  return {
    canonical: localePath(locale, path),
    languages: Object.fromEntries(
      LOCALES.map((each) => [each, localePath(each, path)]),
    ),
  };
}

/**
 * Shared by the root layout and every public page: a page's `openGraph`
 * replaces the layout's whole object, so each one carries all of it.
 */
export const OPEN_GRAPH = {
  type: "website" as const,
  siteName: "MessMate",
  images: [
    {
      url: "/og.png",
      width: 1200,
      height: 630,
      alt: "MessMate: shared mess accounts, settled",
    },
  ],
};

export const ogLocale = (locale: string) =>
  locale === "bn" ? "bn_BD" : "en_BD";

export async function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Promise<Metadata> {
  const locale = await getLocale();

  return {
    title,
    description,
    alternates: await alternates(path),
    openGraph: {
      ...OPEN_GRAPH,
      locale: ogLocale(locale),
      title,
      description,
      url: localePath(locale, path),
    },
    twitter: { card: "summary_large_image" },
  };
}
