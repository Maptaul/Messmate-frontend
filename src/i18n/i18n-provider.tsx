"use client";

import { createContext, type ReactNode, useContext, useEffect } from "react";
import { setErrorTranslator } from "@/lib/errors";
import type { Locale } from "./config";
import { localePath } from "./locale-path";
import {
  createTranslator,
  type Dictionary,
  type Translator,
} from "./translate";

interface I18nValue {
  locale: Locale;
  t: Translator;
}

const I18nContext = createContext<I18nValue | null>(null);

/** Gives client components the current locale and its dictionary. */
export function I18nProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: ReactNode;
}) {
  const t = createTranslator(dictionary);

  // Error toasts are raised outside React (the query cache), so they read
  // the active translator from a module-level slot.
  useEffect(() => setErrorTranslator(t), [t]);

  return <I18nContext value={{ locale, t }}>{children}</I18nContext>;
}

function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}

export const useT = () => useI18n().t;
export const useLocale = () => useI18n().locale;

/** `href("/manager")` → `/manager` in English, `/bn/manager` in Bangla. */
export function useLocalePath() {
  const locale = useLocale();
  return (path: string) => localePath(locale, path);
}
