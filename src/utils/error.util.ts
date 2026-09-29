import { FetchError } from "ofetch";
import { apiMessageKey } from "@/i18n/api-messages";
import type { ApiErrorBody } from "@/types";

const readBody = (error: unknown): ApiErrorBody | undefined =>
  error instanceof FetchError ? (error.data as ApiErrorBody) : undefined;

/**
 * The API's own message (ofetch's `err.message` is just the URL). Known
 * messages come back as dictionary keys, so pass the result through
 * `t.dynamic()` before showing it.
 */
export function getErrorMessage(error: unknown): string {
  const message = readBody(error)?.message;
  if (message) return apiMessageKey(message) ?? message;

  if (error instanceof FetchError && !error.response) return "errors.network";
  return "errors.generic";
}

/** Backend validation errors keyed by field, first message per field. */
export function getFieldErrors(error: unknown): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  for (const { field, message } of readBody(error)?.errors ?? []) {
    fieldErrors[field] ??= message;
  }

  return fieldErrors;
}
