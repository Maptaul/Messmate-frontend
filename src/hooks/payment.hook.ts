import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getCycleBills,
  getMyBills,
  getMyPayments,
  getPayment,
  recordCashPayment,
  startBkashPayment,
  startStripeCheckout,
} from "@/api";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { ApiClient } from "@/lib/api-client";
import { formatBDT } from "@/lib/format";
import type { BillListParams, PaymentListParams } from "@/types";
import { keys } from "./keys";

export const myBillsQuery = (params: BillListParams, client?: ApiClient) =>
  queryOptions({
    queryKey: keys.myBills(params),
    queryFn: () => getMyBills(params, client),
    placeholderData: keepPreviousData,
  });

export const cycleBillsQuery = (
  cycleId: string,
  params: BillListParams,
  client?: ApiClient,
) =>
  queryOptions({
    queryKey: keys.cyclePart(cycleId, "bills", params),
    queryFn: () => getCycleBills(cycleId, params, client),
    placeholderData: keepPreviousData,
  });

export const myPaymentsQuery = (
  params: PaymentListParams,
  client?: ApiClient,
) =>
  queryOptions({
    queryKey: keys.myPayments(params),
    queryFn: () => getMyPayments(params, client),
    placeholderData: keepPreviousData,
  });

export const paymentQuery = (paymentId: string, client?: ApiClient) =>
  queryOptions({
    queryKey: keys.payment(paymentId),
    queryFn: () => getPayment(paymentId, client),
  });

export const useMyBills = (params: BillListParams) =>
  useQuery(myBillsQuery(params));
export const useCycleBills = (cycleId: string, params: BillListParams) =>
  useQuery(cycleBillsQuery(cycleId, params));
export const useMyPayments = (params: PaymentListParams) =>
  useQuery(myPaymentsQuery(params));
export const usePayment = (paymentId: string | null) =>
  useQuery({ ...paymentQuery(paymentId ?? ""), enabled: Boolean(paymentId) });

/** Leaves the app for Stripe Checkout; it returns to /payment/success|cancel. */
export const useStripeCheckout = () => {
  const t = useT();

  return useMutation({
    mutationFn: startStripeCheckout,
    onSuccess: ({ data }) => {
      toast.loading(t("toast.redirectingStripe"));
      window.location.assign(data.checkoutUrl);
    },
  });
};

/** Leaves the app for bKash; the API's callback sends the payer back. */
export const useBkashPayment = () => {
  const t = useT();

  return useMutation({
    mutationFn: startBkashPayment,
    onSuccess: ({ data }) => {
      toast.loading(t("toast.redirectingBkash"));
      window.location.assign(data.paymentUrl);
    },
  });
};

export const useRecordCash = (cycleId: string) => {
  const queryClient = useQueryClient();
  const t = useT();
  const locale = useLocale();

  return useMutation({
    mutationFn: recordCashPayment,
    meta: { silent: true },
    onSuccess: ({ data }) => {
      toast.success(
        t("toast.cashRecorded", { amount: formatBDT(data.amount, locale) }),
      );
      queryClient.invalidateQueries({ queryKey: keys.cycle(cycleId) });
    },
  });
};
