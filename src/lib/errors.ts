import { FetchError } from "ofetch";
import type { ApiErrorBody } from "@/types";

const readBody = (error: unknown): ApiErrorBody | undefined =>
  error instanceof FetchError ? (error.data as ApiErrorBody) : undefined;

/** The backend's own message when there is one — ofetch's is just the URL. */
export function getErrorMessage(error: unknown): string {
  const body = readBody(error);
  if (body?.message) return body.message;

  if (error instanceof FetchError && !error.response) {
    return "Can't reach the MessMate server. Check your connection and try again.";
  }

  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong. Please try again.";
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
