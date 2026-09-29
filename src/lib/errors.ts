import { FetchError } from "ofetch";
import { apiMessageKey } from "@/i18n/api-messages";
import type { Translator } from "@/i18n/translate";
import type { ApiErrorBody } from "@/types";

type Translate = Translator["dynamic"];

// Set by I18nProvider; until then (or on the server) keys fall back to English.
let translate: Translate | null = null;

export function setErrorTranslator(t: Translator) {
  translate = t.dynamic;
}

const ENGLISH_FALLBACK: Record<string, string> = {
  "errors.network":
    "Can't reach the MessMate server. Check your connection and try again.",
  "errors.generic": "Something went wrong. Please try again.",
};

const tr = (key: string) => translate?.(key) ?? ENGLISH_FALLBACK[key] ?? key;

const readBody = (error: unknown): ApiErrorBody | undefined =>
  error instanceof FetchError ? (error.data as ApiErrorBody) : undefined;

/**
 * What to tell the user, in their language: a known API message is
 * translated, an unknown one is shown as the API wrote it, and a dropped
 * connection gets its own sentence (ofetch's own message is just the URL).
 */
export function getErrorMessage(error: unknown): string {
  const message = readBody(error)?.message;
  if (message) {
    const key = apiMessageKey(message);
    return key ? tr(key) : message;
  }

  if (error instanceof FetchError && !error.response)
    return tr("errors.network");
  return tr("errors.generic");
}

/** Backend validation errors keyed by field, first message per field. */
export function getFieldErrors(error: unknown): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  for (const { field, message } of readBody(error)?.errors ?? []) {
    fieldErrors[field] ??= message;
  }

  return fieldErrors;
}

export function getErrorStatus(error: unknown): number | undefined {
  return error instanceof FetchError ? error.status : undefined;
}
