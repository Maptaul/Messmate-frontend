"use client";

import { getMyPayments } from "@/api";
import ExportCsvButton from "@/components/ui/export-csv-button";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import type { Payment } from "@/types";
import { EXPORT_PAGE_SIZE, paymentsParams } from "@/utils";

/** Every payment matching the status filter. */
export default function MyPaymentExport() {
  const t = useT();
  const { get } = useQueryParams();
  const params = paymentsParams(get);

  return (
    <ExportCsvButton<Payment>
      name="payments"
      fetchPage={(page) =>
        getMyPayments({ ...params, page, limit: EXPORT_PAGE_SIZE })
      }
      columns={[
        [
          t("resident.payments.date"),
          (payment) => payment.createdAt.slice(0, 10),
        ],
        [
          t("resident.payments.month"),
          (payment) =>
            `${payment.bill.cycle.year}-${String(payment.bill.cycle.month).padStart(2, "0")}`,
        ],
        [
          t("resident.payments.method"),
          (payment) =>
            t(`resident.payments.gateways.${payment.paymentGateway}`),
        ],
        [t("resident.payments.amount"), (payment) => payment.amount],
        [
          t("resident.payments.status"),
          (payment) => t(`status.${payment.status}`),
        ],
        [
          t("resident.payments.txn"),
          (payment) => payment.bkashTrxId ?? payment.merchantInvoiceNumber,
        ],
        [t("resident.payments.paidAt"), (payment) => payment.paidAt],
      ]}
    />
  );
}
