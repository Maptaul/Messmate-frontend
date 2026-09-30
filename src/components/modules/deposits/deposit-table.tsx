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

  const columns: Column<Deposit>[] = [
    {
      key: "date",
      header: t("manager.deposits.date"),
      className: "whitespace-nowrap text-muted-foreground",
      cell: (deposit) => formatDate(deposit.createdAt, locale),
    },
    {
      key: "member",
      header: t("manager.deposits.member"),
      className: "font-medium",
      cell: (deposit) => deposit.member.user.name,
    },
    {
      key: "amount",
      header: t("manager.deposits.amount"),
      className: "text-right font-semibold whitespace-nowrap tabular-nums",
      cell: (deposit) => formatBDT(deposit.amount, locale),
    },
    {
      key: "note",
      header: t("manager.deposits.note"),
      className: "max-w-64 text-muted-foreground",
      cell: (deposit) => deposit.note || "—",
    },
    {
      key: "by",
      header: t("manager.deposits.by"),
      className: "whitespace-nowrap text-muted-foreground",
      cell: (deposit) => deposit.createdBy.name.split(" ")[0],
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
      <TablePagination
        page={params.page ?? 1}
        totalPages={data?.meta?.totalPages ?? 0}
        total={data?.meta?.total}
        limit={data?.meta?.limit}
        handlePageChange={handlePageChange}
      />
    </>
  );
}
