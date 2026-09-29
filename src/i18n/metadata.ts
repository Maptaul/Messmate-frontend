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
