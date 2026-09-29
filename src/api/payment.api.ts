import { type ApiClient, apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  BillListParams,
  BkashCheckout,
  CycleBill,
  MyBill,
  Payment,
  PaymentListParams,
  RecordCashPayload,
  StripeCheckout,
  StripeConfirmation,
} from "@/types";

export function getMyBills(
  params: BillListParams,
  client: ApiClient = apiClient,
) {
  return client<ApiResponse<MyBill[]>>("/payment/my-bills", { query: params });
}

export function getCycleBills(
  cycleId: string,
  params: BillListParams,
  client: ApiClient = apiClient,
) {
  return client<ApiResponse<CycleBill[]>>(`/payment/cycle-bills/${cycleId}`, {
    query: params,
  });
}

export function getMyPayments(
  params: PaymentListParams,
  client: ApiClient = apiClient,
) {
  return client<ApiResponse<Payment[]>>("/payment/my-payments", {
    query: params,
  });
}

export function getPayment(paymentId: string, client: ApiClient = apiClient) {
  return client<ApiResponse<Payment>>(`/payment/${paymentId}`);
}

/** Card: returns a Stripe Checkout URL for the bill's full due. */
export function startStripeCheckout(billId: string) {
  return apiClient<ApiResponse<StripeCheckout>>(
    "/payment/create-stripe-session",
    { method: "POST", body: { billId } },
  );
}

/** Called by /payment/success with Stripe's session id; safe to repeat. */
export function confirmStripePayment(
  sessionId: string,
  client: ApiClient = apiClient,
) {
  return client<ApiResponse<StripeConfirmation>>("/payment/confirm-stripe", {
    method: "POST",
    body: { sessionId },
  });
}

/** bKash: returns the hosted bKash page for the bill's full due. */
export function startBkashPayment(billId: string) {
  return apiClient<ApiResponse<BkashCheckout>>("/payment/create-payment", {
    method: "POST",
    body: { billId },
  });
}

/** Manager only; partial amounts allowed. */
export function recordCashPayment(payload: RecordCashPayload) {
  return apiClient<ApiResponse<{ id: string; amount: string }>>(
    "/payment/record-cash-payment",
    { method: "POST", body: payload },
  );
}
