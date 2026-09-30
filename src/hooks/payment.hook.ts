import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  getCycleBills,
  getMyBills,
  getMyPayments,
  getPayment,
  recordCashPayment,
  startBkashPayment,
  startStripeCheckout,
} from "@/api";
import type { BillListParams, PaymentListParams } from "@/types";

export function useSuspenseMyBills(params: BillListParams) {
  return useSuspenseQuery({
    queryKey: ["my-bills", params],
    queryFn: () => getMyBills(params),
  });
}

/** Unpaid bills for the sidebar badge; never blocks the page. */
export function useMyBills(params: BillListParams, enabled = true) {
  return useQuery({
    queryKey: ["my-bills", params],
    queryFn: () => getMyBills(params),
    enabled,
  });
}

export function useCycleBills(cycleId: string, params: BillListParams) {
  return useQuery({
    queryKey: ["cycle-bills", cycleId, params],
    queryFn: () => getCycleBills(cycleId, params),
    enabled: Boolean(cycleId),
  });
}

export function useSuspenseCycleBills(cycleId: string, params: BillListParams) {
  return useSuspenseQuery({
    queryKey: ["cycle-bills", cycleId, params],
    queryFn: () => getCycleBills(cycleId, params),
  });
}

export function useSuspenseMyPayments(params: PaymentListParams) {
  return useSuspenseQuery({
    queryKey: ["my-payments", params],
    queryFn: () => getMyPayments(params),
  });
}

export function usePayment(paymentId: string) {
  return useQuery({
    queryKey: ["payment", paymentId],
    queryFn: () => getPayment(paymentId),
    enabled: Boolean(paymentId),
  });
}

/** Card: returns Stripe's hosted checkout URL. */
export function useStripeCheckout() {
  return useMutation({
    mutationFn: startStripeCheckout,
  });
}

/** bKash: returns bKash's hosted payment URL. */
export function useBkashPayment() {
  return useMutation({
    mutationFn: startBkashPayment,
  });
}

export function useRecordCash() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recordCashPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cycle-bills"] });
    },
  });
}
