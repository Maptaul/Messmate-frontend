import { useMutation } from "@tanstack/react-query";
import { fetchAllPages } from "@/utils";

type PageFetcher<T> = Parameters<typeof fetchAllPages<T>>[0];

/** Every row behind a table's current filters, page by page. */
export function useExportRows<T>() {
  return useMutation({
    mutationFn: (fetchPage: PageFetcher<T>) => fetchAllPages(fetchPage),
  });
}
