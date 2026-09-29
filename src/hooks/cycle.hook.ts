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

export function useMessCycles(messId: string, params: CycleListParams) {
  return useQuery({
    queryKey: ["cycles", messId, params],
    queryFn: () => getMessCycles(messId, params),
    enabled: !!messId,
  });
}

export function useSuspenseMessCycles(messId: string, params: CycleListParams) {
  return useSuspenseQuery({
    queryKey: ["cycles", messId, params],
    queryFn: () => getMessCycles(messId, params),
  });
}

export function useSuspenseCycle(cycleId: string) {
  return useSuspenseQuery({
    queryKey: ["cycle", cycleId],
    queryFn: () => getCycle(cycleId),
  });
}

export function useSuspenseSettlementPreview(cycleId: string) {
  return useSuspenseQuery({
    queryKey: ["settlement", cycleId],
    queryFn: () => getSettlementPreview(cycleId),
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
