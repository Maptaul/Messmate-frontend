"use client";

import { getCycleBills } from "@/api";
import ExportCsvButton from "@/components/ui/export-csv-button";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import type { CycleBill } from "@/types";
import { billsParams, EXPORT_PAGE_SIZE } from "@/utils";

/** Every bill of the month matching the search and status filters. */
export default function BillExport({ cycleId }: { cycleId: string }) {
  const t = useT();
  const { get } = useQueryParams();
  const params = billsParams(get);

  return (
    <ExportCsvButton<CycleBill>
      name="bills"
      fetchPage={(page) =>
        getCycleBills(cycleId, { ...params, page, limit: EXPORT_PAGE_SIZE })
      }
      columns={[
        [t("manager.bills.member"), (bill) => bill.member.user.name],
        [t("manager.bills.email"), (bill) => bill.member.user.email],
        [t("manager.bills.meals"), (bill) => bill.mealCount],
        [t("manager.bills.mealCost"), (bill) => bill.mealCost],
        [t("manager.bills.shared"), (bill) => bill.sharedCost],
        [t("manager.bills.rent"), (bill) => bill.rentShare],
        [t("manager.bills.payable"), (bill) => bill.totalPayable],
        [t("manager.bills.credit"), (bill) => bill.creditAmount],
        [t("manager.bills.paid"), (bill) => bill.paidAmount],
        [t("manager.bills.due"), (bill) => bill.dueAmount],
        [t("manager.bills.status"), (bill) => t(`status.${bill.status}`)],
      ]}
    />
  );
}
