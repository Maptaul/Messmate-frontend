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

/** Title, description, canonical + language links and Open Graph for a public page. */
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
    openGraph: { title, description, url: localePath(locale, path) },
  };
}
