import type { ListParams, Money } from "./api.type";

export type BillStatus = "UNPAID" | "PARTIAL" | "PAID";
export type PaymentStatus =
  | "UNPAID"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";
export type PaymentGateway = "bkash" | "stripe" | "cash";

export interface BillMoney {
  id: string;
  mealCount: number;
  mealCost: Money;
  sharedCost: Money;
  rentShare: Money;
  totalPayable: Money;
  creditAmount: Money;
  paidAmount: Money;
  /** ≤ 0 means settled or in credit — never offer "Pay". */
  dueAmount: Money;
  status: BillStatus;
}

export interface MyBill extends BillMoney {
  cycle: {
    id: string;
    year: number;
    month: number;
    mess: { id: string; name: string };
  };
}

export interface CycleBill extends BillMoney {
  member: { id: string; user: { name: string; email: string } };
}

export interface BillListParams extends ListParams {
  status?: BillStatus;
}

export interface Payment {
  id: string;
  status: PaymentStatus;
  amount: Money;
  currency: string;
  paymentGateway: PaymentGateway;
  merchantInvoiceNumber: string;
  bkashPaymentId: string | null;
  bkashTrxId: string | null;
  paidAt: string | null;
  createdAt: string;
  bill: {
    id: string;
    dueAmount: Money;
    status: BillStatus;
    cycle: { id: string; year: number; month: number };
  };
}

export interface PaymentListParams extends ListParams {
  status?: PaymentStatus;
}

export interface BkashCheckout {
  paymentId: string;
  amount: string;
  paymentUrl: string;
}

export interface StripeCheckout {
  paymentId: string;
  amount: string;
  checkoutUrl: string;
}

export interface StripeConfirmation {
  paid: boolean;
  paymentId: string;
}

export interface RecordCashPayload {
  billId: string;
  amount: number;
  note?: string;
}
