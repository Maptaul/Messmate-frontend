"use client";

import { getCycleDeposits } from "@/api";
import ExportCsvButton from "@/components/ui/export-csv-button";
import useQueryParams from "@/hooks/query-params.hook";
import { useT } from "@/i18n/i18n-provider";
import type { Deposit } from "@/types";
import { depositsParams, EXPORT_PAGE_SIZE } from "@/utils";

export default function DepositExport({ cycleId }: { cycleId: string }) {
  const t = useT();
  const { get } = useQueryParams();
  const params = depositsParams(get);

  return (
    <ExportCsvButton<Deposit>
      name="deposits"
      fetchPage={(page) =>
        getCycleDeposits(cycleId, { ...params, page, limit: EXPORT_PAGE_SIZE })
      }
      columns={[
        [
          t("manager.deposits.date"),
          (deposit) => deposit.createdAt.slice(0, 10),
        ],
        [t("manager.deposits.member"), (deposit) => deposit.member.user.name],
        [t("manager.deposits.amount"), (deposit) => deposit.amount],
        [t("manager.deposits.note"), (deposit) => deposit.note ?? ""],
        [t("manager.deposits.by"), (deposit) => deposit.createdBy.name],
      ]}
    />
  );
}
