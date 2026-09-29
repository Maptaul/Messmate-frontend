import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  closeCycle,
  getCycle,
  getMessCycles,
  getSettlementPreview,
  openCycle,
  reopenCycle,
} from "@/api";
import type { CycleListParams } from "@/types";

export function useSuspenseMessCycles(messId: string, params: CycleListParams) {
  return useSuspenseQuery({
    queryKey: ["cycles", messId, params],
    queryFn: () => getMessCycles(messId, params),
  });
}

/** The mess's OPEN month, if any — most manager pages work on it. */
export function useOpenCycle(messId: string) {
  return useQuery({
    queryKey: ["cycles", messId, { status: "OPEN" }],
    queryFn: () => getMessCycles(messId, { status: "OPEN", limit: 1 }),
    select: (res) => res.data[0] ?? null,
  });
}

export function useSuspenseCycle(cycleId: string) {
  return useSuspenseQuery({
    queryKey: ["cycle", cycleId],
    queryFn: () => getCycle(cycleId),
  });
}

export function useSettlementPreview(cycleId: string, enabled = true) {
  return useQuery({
    queryKey: ["settlement", cycleId],
    queryFn: () => getSettlementPreview(cycleId),
    enabled,
  });
}

export function useOpenNewCycle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: openCycle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cycles"] });
      queryClient.invalidateQueries({ queryKey: ["mess"] });
    },
  });
}

export function useCloseCycle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: closeCycle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cycles"] });
      queryClient.invalidateQueries({ queryKey: ["cycle"] });
      queryClient.invalidateQueries({ queryKey: ["settlement"] });
      queryClient.invalidateQueries({ queryKey: ["cycle-bills"] });
      queryClient.invalidateQueries({ queryKey: ["my-bills"] });
    },
  });
}

export function useReopenCycle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reopenCycle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cycles"] });
      queryClient.invalidateQueries({ queryKey: ["cycle"] });
      queryClient.invalidateQueries({ queryKey: ["cycle-bills"] });
      queryClient.invalidateQueries({ queryKey: ["mess"] });
    },
  });
}
