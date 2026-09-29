"use client";

import { HandCoinsIcon } from "lucide-react";
import DataTable, { type Column } from "@/components/ui/data-table";
import TablePagination from "@/components/ui/table-pagination";
import { useSuspenseCycleDeposits } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { Deposit, DepositListParams } from "@/types";
import { formatBDT, formatDate } from "@/utils";
import DepositActions from "./deposit-actions";

interface Props extends DepositListParams {
  cycleId: string;
  messId: string;
  canEdit: boolean;
  handlePageChange: (page: number) => void;
}

export default function DepositTable({
  cycleId,
  messId,
  canEdit,
  handlePageChange,
  ...params
}: Props) {
  const t = useT();
  const locale = useLocale();

  const { data } = useSuspenseCycleDeposits(cycleId, params);

  const deposits = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;

  const columns: Column<Deposit>[] = [
    {
      key: "date",
      header: t("manager.deposits.date"),
      className: "whitespace-nowrap",
      cell: (deposit) => formatDate(deposit.createdAt, locale),
    },
    {
      key: "member",
      header: t("manager.deposits.member"),
      cell: (deposit) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{deposit.member.user.name}</p>
          {deposit.note && (
            <p className="max-w-56 truncate text-xs text-muted-foreground">
              {deposit.note}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "amount",
      header: t("manager.deposits.amount"),
      className: "tabular-nums",
      cell: (deposit) => formatBDT(deposit.amount, locale),
    },
    {
      key: "by",
      header: t("manager.deposits.by"),
      className: "hidden md:table-cell",
      cell: (deposit) => deposit.createdBy.name,
    },
    {
      key: "actions",
      header: <span className="sr-only">{t("manager.deposits.actions")}</span>,
      className: "text-right",
      cell: (deposit) =>
        canEdit ? (
          <DepositActions deposit={deposit} cycleId={cycleId} messId={messId} />
        ) : null,
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        rows={deposits}
        rowKey={(deposit) => deposit.id}
        caption={t("manager.deposits.caption")}
        empty={{
          icon: HandCoinsIcon,
          title: t("manager.deposits.empty"),
          description: t("manager.deposits.emptyHint"),
        }}
      />
      {totalPages > 1 && (
        <div className="my-5">
          <TablePagination
            page={params.page ?? 1}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
}
