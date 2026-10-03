import { useMutation } from "@tanstack/react-query";
import { fetchAllPages } from "@/utils";

type PageFetcher<T> = Parameters<typeof fetchAllPages<T>>[0];

export function useExportRows<T>() {
  return useMutation({
    mutationFn: (fetchPage: PageFetcher<T>) => fetchAllPages(fetchPage),
  });
}
