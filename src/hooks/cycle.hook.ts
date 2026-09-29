import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  closeCycle,
  getCycle,
  getMessCycles,
  getSettlementPreview,
  openCycle,
  reopenCycle,
} from "@/api";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { ApiClient } from "@/lib/api-client";
import { formatMonth, formatNumber } from "@/lib/format";
import type { CycleListParams } from "@/types";
import { keys } from "./keys";

export const messCyclesQuery = (
  messId: string,
  params: CycleListParams,
  client?: ApiClient,
) =>
  queryOptions({
    queryKey: keys.messCycles(messId, params),
    queryFn: () => getMessCycles(messId, params, client),
    placeholderData: keepPreviousData,
  });

/** The mess's OPEN cycle, if it has one — most manager pages work on it. */
export const openCycleQuery = (messId: string, client?: ApiClient) =>
  queryOptions({
    queryKey: keys.messCycles(messId, { status: "OPEN" }),
    queryFn: () => getMessCycles(messId, { status: "OPEN", limit: 1 }, client),
    select: (res) => res.data[0] ?? null,
  });

export const cycleQuery = (cycleId: string, client?: ApiClient) =>
  queryOptions({
    queryKey: keys.cyclePart(cycleId, "detail"),
    queryFn: () => getCycle(cycleId, client),
  });

export const settlementPreviewQuery = (cycleId: string, client?: ApiClient) =>
  queryOptions({
    queryKey: keys.cyclePart(cycleId, "settlement"),
    queryFn: () => getSettlementPreview(cycleId, client),
  });

export const useMessCycles = (messId: string, params: CycleListParams) =>
  useQuery(messCyclesQuery(messId, params));
export const useOpenCycle = (messId: string) =>
  useQuery(openCycleQuery(messId));
export const useCycle = (cycleId: string) => useQuery(cycleQuery(cycleId));
export const useSettlementPreview = (cycleId: string, enabled = true) =>
  useQuery({ ...settlementPreviewQuery(cycleId), enabled });

export const useStartCycle = () => {
  const queryClient = useQueryClient();
  const t = useT();
  const locale = useLocale();

  return useMutation({
    mutationFn: openCycle,
    meta: { silent: true },
    onSuccess: ({ data }) => {
      toast.success(
        t("toast.cycleOpened", {
          month: formatMonth(data.year, data.month, locale),
        }),
      );
      queryClient.invalidateQueries({ queryKey: keys.mess(data.mess.id) });
    },
  });
};

export const useCloseCycle = () => {
  const queryClient = useQueryClient();
  const t = useT();
  const locale = useLocale();

  return useMutation({
    mutationFn: closeCycle,
    onSuccess: ({ data }) => {
      toast.success(
        t("toast.cycleClosed", {
          month: formatMonth(data.cycle.year, data.cycle.month, locale),
          count: formatNumber(data.bills.length, locale),
        }),
      );
      queryClient.invalidateQueries({ queryKey: keys.cycle(data.cycle.id) });
      queryClient.invalidateQueries({
        queryKey: keys.mess(data.cycle.mess.id),
      });
    },
  });
};

export const useReopenCycle = () => {
  const queryClient = useQueryClient();
  const t = useT();
  const locale = useLocale();

  return useMutation({
    mutationFn: reopenCycle,
    onSuccess: ({ data }) => {
      toast.success(
        t("toast.cycleReopened", {
          month: formatMonth(data.year, data.month, locale),
        }),
      );
      queryClient.invalidateQueries({ queryKey: keys.cycle(data.id) });
      queryClient.invalidateQueries({ queryKey: keys.mess(data.mess.id) });
    },
  });
};
