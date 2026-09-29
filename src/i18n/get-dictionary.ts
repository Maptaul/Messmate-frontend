import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { isLocale, type Locale } from "./config";
import bn from "./dictionaries/bn.json";
import en from "./dictionaries/en.json";
import { createTranslator, type Dictionary } from "./translate";

// Typed as Dictionary, so a key missing from bn.json fails the typecheck.
const DICTIONARIES: Record<Locale, Dictionary> = { en, bn };

/** The locale of the current request (the `[lang]` segment). */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (!isLocale(value)) notFound();
  return value;
}

export async function getDictionary(): Promise<Dictionary> {
  return DICTIONARIES[await getLocale()];
}

/** Server-side `t()`: `const t = await getT(); t("auth.login.title")`. */
export async function getT() {
  return createTranslator(await getDictionary());
}
