import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  addFinanceEntry,
  deleteFinanceEntry,
  getFinanceCategories,
  getFinanceEntries,
  getFinanceSummary,
  removeAvatar,
  updateFinanceEntry,
  updateProfile,
  uploadAvatar,
} from "@/api";
import type { FinanceEntryParams, SummaryPeriod } from "@/types";

// --- Profile ---------------------------------------------------------------

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useRemoveAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

// --- Personal finance -------------------------------------------------------

export function useFinanceCategories() {
  return useQuery({
    queryKey: ["finance-categories"],
    queryFn: () => getFinanceCategories(),
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useSuspenseFinanceEntries(params: FinanceEntryParams) {
  return useSuspenseQuery({
    queryKey: ["finance-entries", params],
    queryFn: () => getFinanceEntries(params),
  });
}

export function useSuspenseFinanceSummary(params: {
  period: SummaryPeriod;
  date?: string;
}) {
  return useSuspenseQuery({
    queryKey: ["finance-summary", params],
    queryFn: () => getFinanceSummary(params),
  });
}

function useInvalidateFinance() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["finance-entries"] });
    queryClient.invalidateQueries({ queryKey: ["finance-summary"] });
  };
}

export function useAddFinanceEntry() {
  const invalidate = useInvalidateFinance();

  return useMutation({
    mutationFn: addFinanceEntry,
    onSuccess: invalidate,
  });
}

export function useUpdateFinanceEntry() {
  const invalidate = useInvalidateFinance();

  return useMutation({
    mutationFn: updateFinanceEntry,
    onSuccess: invalidate,
  });
}

export function useDeleteFinanceEntry() {
  const invalidate = useInvalidateFinance();

  return useMutation({
    mutationFn: deleteFinanceEntry,
    onSuccess: invalidate,
  });
}

/** Every entry matching the filters, page by page (the API caps a page at 100). */
export function useExportFinanceEntries() {
  return useMutation({
    mutationFn: async (params: FinanceEntryParams) => {
      const first = await getFinanceEntries({ ...params, page: 1, limit: 100 });
      const entries = [...first.data];

      for (let page = 2; page <= first.meta.totalPages; page++) {
        const next = await getFinanceEntries({ ...params, page, limit: 100 });
        entries.push(...next.data);
      }

      return entries;
    },
  });
}
