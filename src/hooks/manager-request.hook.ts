import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  applyForManager,
  getManagerRequests,
  reviewManagerRequest,
} from "@/api";
import type { ManagerRequestParams } from "@/types";

export function useManagerRequests(
  params: ManagerRequestParams,
  enabled = true,
) {
  return useQuery({
    queryKey: ["manager-requests", params],
    queryFn: () => getManagerRequests(params),
    enabled,
  });
}

export function useSuspenseManagerRequests(params: ManagerRequestParams) {
  return useSuspenseQuery({
    queryKey: ["manager-requests", params],
    queryFn: () => getManagerRequests(params),
  });
}

export function useApplyForManager() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyForManager,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useReviewManagerRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewManagerRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager-requests"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
}
