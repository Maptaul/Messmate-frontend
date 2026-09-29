import { FetchError } from "ofetch";
import type { ApiErrorBody } from "@/types";

/** The API rejects files over 4 MB with a 500, so check before sending. */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export const RECEIPT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];
export const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

export type UploadProblem = "tooLarge" | "wrongType";

export function checkUpload(
  file: File,
  allowedTypes: string[],
): UploadProblem | null {
  if (!allowedTypes.includes(file.type)) return "wrongType";
  if (file.size > MAX_UPLOAD_BYTES) return "tooLarge";
  return null;
}

/**
 * Multipart request with upload progress (fetch can't report it). Same-origin,
 * so the auth cookies ride along. Failures throw a FetchError carrying the
 * API's error body, so getErrorMessage/getFieldErrors work unchanged.
 */
export function uploadWithProgress<T>(
  path: string,
  body: FormData,
  {
    method = "POST",
    onProgress,
  }: { method?: "POST" | "PATCH"; onProgress?: (percent: number) => void } = {},
): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, `/api/v1${path}`);
    xhr.responseType = "json";

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress?.(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response as T);
        return;
      }
      const data = xhr.response as ApiErrorBody | null;
      const error = new FetchError(
        data?.message ?? `Upload failed (${xhr.status})`,
      );
      error.data = data;
      error.status = xhr.status;
      error.statusCode = xhr.status;
      error.response = new Response(null, { status: xhr.status });
      reject(error);
    };

    // No response at all: getErrorMessage turns this into "can't reach the server".
    xhr.onerror = () => reject(new FetchError("Network error"));

    xhr.send(body);
  });
}

/** Appends every defined field as a string, the way multer expects them. */
export function toFormData(
  fields: Record<string, string | number | File | undefined>,
) {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === "") continue;
    form.append(key, value instanceof File ? value : String(value));
  }
  return form;
}
