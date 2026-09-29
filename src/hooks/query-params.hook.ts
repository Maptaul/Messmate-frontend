import { usePathname, useSearchParams } from "next/navigation";

type ParamValue = string | number | null | undefined;

/**
 * B7A7: filters, search and page live in the URL (bookmarkable). Same job as
 * the reference's `useState` for tab/search/page, but read from and written
 * to the query string. history.replaceState keeps useSearchParams in sync
 * without a server round-trip.
 */
export default function useQueryParams() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const get = (key: string) => searchParams.get(key) ?? undefined;

  const set = (updates: Record<string, ParamValue>) => {
    const next = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === undefined || value === "") {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    }

    // A new filter starts from page 1, like the reference's setPage(1).
    if (!("page" in updates)) next.delete("page");

    const query = next.toString();
    window.history.replaceState(
      null,
      "",
      query ? `${pathname}?${query}` : pathname,
    );
  };

  const page = Math.max(Number(searchParams.get("page")) || 1, 1);

  return { searchParams, get, set, page };
}
