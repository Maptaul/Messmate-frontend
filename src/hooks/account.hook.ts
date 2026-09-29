import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  addFinanceEntry,
  deleteFinanceEntry,
  getFinanceCategories,
  getFinanceEntries,
  getFinanceSummary,
  refreshToken,
  removeAvatar,
  updateFinanceEntry,
  updateProfile,
  uploadAvatar,
} from "@/api";
import { useT } from "@/i18n/i18n-provider";
import type { ApiClient } from "@/lib/api-client";
import type { FinanceEntryParams, SummaryPeriod } from "@/types";
import { keys } from "./keys";

// --- Profile ---------------------------------------------------------------

/** Re-renders server components (sidebar avatar, name) after a change. */
function useProfileRefresh() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return () => {
    queryClient.invalidateQueries({ queryKey: keys.me });
    router.refresh();
  };
}

/**
 * The API kills the access token when the name changes, so trade the refresh
 * token for a new pair before anything else asks for data.
 */
export const useUpdateProfile = () => {
  const refreshView = useProfileRefresh();
  const t = useT();

  return useMutation({
    mutationFn: async (payload: Parameters<typeof updateProfile>[0]) => {
      const result = await updateProfile(payload);
      await refreshToken();
      return result;
    },
    meta: { silent: true },
    onSuccess: () => {
      toast.success(t("toast.profileSaved"));
      refreshView();
    },
  });
};

export const useUploadAvatar = () => {
  const refreshView = useProfileRefresh();
  const t = useT();

  return useMutation({
    mutationFn: uploadAvatar,
    meta: { silent: true },
    onSuccess: () => {
      toast.success(t("toast.photoUpdated"));
      refreshView();
    },
  });
};

export const useRemoveAvatar = () => {
  const refreshView = useProfileRefresh();
  const t = useT();

  return useMutation({
    mutationFn: removeAvatar,
    onSuccess: () => {
      toast.success(t("toast.photoRemoved"));
      refreshView();
    },
  });
};

// --- Personal finance -------------------------------------------------------

export const financeCategoriesQuery = (client?: ApiClient) =>
  queryOptions({
    queryKey: keys.financeCategories,
    queryFn: () => getFinanceCategories(client),
    staleTime: Number.POSITIVE_INFINITY,
  });

export const financeEntriesQuery = (
  params: FinanceEntryParams,
  client?: ApiClient,
) =>
  queryOptions({
    queryKey: keys.financeEntries(params),
    queryFn: () => getFinanceEntries(params, client),
    placeholderData: keepPreviousData,
  });

export const financeSummaryQuery = (
  params: { period: SummaryPeriod; date?: string },
  client?: ApiClient,
) =>
  queryOptions({
    queryKey: keys.financeSummary(params),
    queryFn: () => getFinanceSummary(params, client),
    placeholderData: keepPreviousData,
  });

export const useFinanceCategories = () => useQuery(financeCategoriesQuery());
export const useFinanceEntries = (params: FinanceEntryParams) =>
  useQuery(financeEntriesQuery(params));
export const useFinanceSummary = (params: {
  period: SummaryPeriod;
  date?: string;
}) => useQuery(financeSummaryQuery(params));

function useFinanceWrite<TVars, TRes>(
  mutationFn: (vars: TVars) => Promise<TRes>,
  message: () => string,
  silent: boolean,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    meta: { silent },
    onSuccess: () => {
      toast.success(message());
      queryClient.invalidateQueries({ queryKey: keys.finance });
    },
  });
}

export const useAddFinanceEntry = () => {
  const t = useT();
  return useFinanceWrite(addFinanceEntry, () => t("toast.entryAdded"), true);
};

export const useUpdateFinanceEntry = () => {
  const t = useT();
  return useFinanceWrite(updateFinanceEntry, () => t("toast.saved"), true);
};

export const useDeleteFinanceEntry = () => {
  const t = useT();
  return useFinanceWrite(deleteFinanceEntry, () => t("toast.deleted"), false);
};
