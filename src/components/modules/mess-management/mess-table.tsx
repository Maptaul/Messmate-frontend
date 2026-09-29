"use client";

import { Building2Icon } from "lucide-react";
import Link from "next/link";
import DataTable, { type Column } from "@/components/ui/data-table";
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
  const totalPages = data?.meta?.totalPages ?? 0;

  const columns: Column<Mess>[] = [
    {
      key: "mess",
      header: t("admin.messes.mess"),
      cell: (mess) => (
        <div className="min-w-0">
          <Link
            href={href(`/admin/messes/${mess.id}`)}
            className="block truncate font-medium underline-offset-4 hover:underline"
          >
            {mess.name}
          </Link>
          <p className="truncate text-xs text-muted-foreground">
            {mess.address}
          </p>
        </div>
      ),
    },
    {
      key: "manager",
      header: t("admin.messes.manager"),
      className: "hidden md:table-cell",
      cell: (mess) => (
        <div className="min-w-0">
          <p className="truncate">{mess.manager.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {mess.manager.email}
          </p>
        </div>
      ),
    },
    {
      key: "members",
      header: t("admin.messes.members"),
      className: "tabular-nums",
      cell: (mess) => formatNumber(mess._count.members, locale),
    },
    {
      key: "cycles",
      header: t("admin.messes.cycles"),
      className: "hidden tabular-nums lg:table-cell",
      cell: (mess) => formatNumber(mess._count.cycles, locale),
    },
    {
      key: "rent",
      header: t("admin.messes.rent"),
      className: "hidden tabular-nums sm:table-cell",
      cell: (mess) => formatBDT(mess.monthlyRent, locale),
    },
    {
      key: "created",
      header: t("admin.messes.created"),
      className: "hidden lg:table-cell",
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
