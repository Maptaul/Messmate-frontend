import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { isLocale, type Locale } from "./config";
import bn from "./dictionaries/bn.json";
import en from "./dictionaries/en.json";
import { createTranslator, type Dictionary } from "./translate";

// Typed as Dictionary, so a key missing from bn.json fails the typecheck.
const DICTIONARIES: Record<Locale, Dictionary> = { en, bn };

export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (!isLocale(value)) notFound();
  return value;
}

export async function getDictionary(): Promise<Dictionary> {
  return DICTIONARIES[await getLocale()];
}

export async function getT() {
  return createTranslator(await getDictionary());
}
