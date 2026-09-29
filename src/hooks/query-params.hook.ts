import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type ParamValue = string | number | null | undefined;

/**
 * Filters, search and pagination live in the URL so a view can be bookmarked
 * or shared. Updates use history.replaceState, which Next keeps in sync with
 * useSearchParams without a server round-trip; TanStack Query refetches off
 * the new key.
 */
export function useQueryParams() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const get = useCallback(
    (key: string) => searchParams.get(key) ?? undefined,
    [searchParams],
  );

  const set = useCallback(
    (updates: Record<string, ParamValue>, { resetPage = true } = {}) => {
      const next = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === undefined || value === "") {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      }

      // Changing a filter while on page 5 would often show an empty page.
      if (resetPage && !("page" in updates)) next.delete("page");

      const query = next.toString();
      window.history.replaceState(
        null,
        "",
        query ? `${pathname}?${query}` : pathname,
      );
    },
    [pathname, searchParams],
  );

  return { searchParams, get, set };
}

/** Reads the shared list params from a URLSearchParams-like source. */
export function readPage(value: string | undefined) {
  const page = Number(value);
  return Number.isInteger(page) && page > 1 ? page : 1;
}
