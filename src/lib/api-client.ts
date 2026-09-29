import { FetchError, type FetchOptions, ofetch } from "ofetch";

/**
 * The one shape every API function accepts, so the same function runs in the
 * browser (apiClient) and in a Server Component prefetch (serverApi()).
 */
export type ApiClient = <T>(
  url: string,
  options?: FetchOptions<"json">,
) => Promise<T>;

// Same-origin: next.config.ts rewrites /api/v1/* to the backend.
const browserFetch = ofetch.create({
  baseURL: "/api/v1",
  credentials: "include",
});

let refreshing: Promise<boolean> | null = null;

// One refresh at a time, however many requests hit a 401 together.
const refreshSession = () => {
  refreshing ??= browserFetch("/auth/refresh-token", { method: "POST" })
    .then(() => true)
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });

  return refreshing;
};

/**
 * A 401 usually means the access token expired, or the backend killed it
 * because the user's name or role changed. Refresh once and retry; if that
 * fails too, the session is over.
 */
export const apiClient: ApiClient = async <T>(
  url: string,
  options?: FetchOptions<"json">,
) => {
  try {
    return await browserFetch<T>(url, options);
  } catch (error) {
    const isExpired =
      error instanceof FetchError &&
      error.status === 401 &&
      !url.startsWith("/auth/");

    if (!isExpired) throw error;

    if (await refreshSession()) return browserFetch<T>(url, options);

    const here = window.location.pathname + window.location.search;
    window.location.assign(`/login?redirect=${encodeURIComponent(here)}`);
    throw error;
  }
};
