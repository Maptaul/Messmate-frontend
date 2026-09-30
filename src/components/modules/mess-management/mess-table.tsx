"use client";

import { Building2Icon } from "lucide-react";
import Link from "next/link";
import DataTable, { type Column } from "@/components/ui/data-table";
import StatusBadge from "@/components/ui/status-badge";
import TablePagination from "@/components/ui/table-pagination";
import { useSuspenseAllMesses } from "@/hooks";
import { useLocale, useLocalePath, useT } from "@/i18n/i18n-provider";
import type { Mess, MessListParams } from "@/types";
import { formatBDT, formatDate, formatNumber } from "@/utils";
import MessActions from "./mess-actions";

interface Props extends MessListParams {
  handlePageChange: (page: number) => void;
}

export default function MessTable({ handlePageChange, ...params }: Props) {
  const t = useT();
  const locale = useLocale();
  const href = useLocalePath();

  const { data } = useSuspenseAllMesses(params);

  const messes = data?.data ?? [];

  const columns: Column<Mess>[] = [
    {
      key: "mess",
      header: t("admin.messes.mess"),
      cell: (mess) => (
        <Link
          href={href(`/admin/messes/${mess.id}`)}
          className="grid min-w-0 leading-tight text-foreground"
        >
          <span className="flex items-center gap-1.5 font-medium">
            <span className="truncate">{mess.name}</span>
            {mess.cycles?.length ? (
              <StatusBadge status="OPEN" className="h-5 px-1.5 text-[11px]" />
            ) : null}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {mess.address}
          </span>
        </Link>
      ),
    },
    {
      key: "manager",
      header: t("admin.messes.manager"),
      cell: (mess) => (
        <span className="grid min-w-0 leading-tight">
          <span className="truncate">{mess.manager.name}</span>
          <span className="truncate text-xs text-muted-foreground">
            {mess.manager.email}
          </span>
        </span>
      ),
    },
    {
      key: "members",
      header: t("admin.messes.members"),
      className: "text-right tabular-nums",
      cell: (mess) => formatNumber(mess._count.members, locale),
    },
    {
      key: "cycles",
      header: t("admin.messes.cycles"),
      className: "text-right tabular-nums",
      cell: (mess) => formatNumber(mess._count.cycles, locale),
    },
    {
      key: "rent",
      header: t("admin.messes.rent"),
      className: "text-right tabular-nums",
      cell: (mess) => formatBDT(mess.monthlyRent, locale),
    },
    {
      key: "advance",
      header: t("admin.messes.advance"),
      className: "text-right tabular-nums",
      cell: (mess) => formatBDT(mess.monthlyDeposit, locale),
    },
    {
      key: "created",
      header: t("admin.messes.created"),
      className: "text-muted-foreground",
      cell: (mess) => formatDate(mess.createdAt, locale),
    },
    {
      key: "actions",
      header: <span className="sr-only">{t("admin.messes.actions")}</span>,
      className: "text-right",
      cell: (mess) => <MessActions mess={mess} />,
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        rows={messes}
        rowKey={(mess) => mess.id}
        caption={t("admin.messes.caption")}
        empty={{
          icon: Building2Icon,
          title: t("admin.messes.empty"),
          description: t("admin.messes.emptyHint"),
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
