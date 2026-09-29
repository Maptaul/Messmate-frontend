"use client";

import { ScrollTextIcon } from "lucide-react";
import DataTable, { type Column } from "@/components/ui/data-table";
import StatusBadge from "@/components/ui/status-badge";
import TablePagination from "@/components/ui/table-pagination";
import { useSuspenseAuditLogs } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { AuditLog, AuditLogParams } from "@/types";
import { formatDateTime } from "@/utils";
import AuditChangeDialog from "./audit-change-dialog";

interface Props extends AuditLogParams {
  handlePageChange: (page: number) => void;
}

export default function AuditLogTable({ handlePageChange, ...params }: Props) {
  const t = useT();
  const locale = useLocale();

  const { data } = useSuspenseAuditLogs(params);

  const logs = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;

  const columns: Column<AuditLog>[] = [
    {
      key: "when",
      header: t("admin.auditPage.when"),
      className: "whitespace-nowrap",
      cell: (log) => formatDateTime(log.createdAt, locale),
    },
    {
      key: "actor",
      header: t("admin.auditPage.actor"),
      cell: (log) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{log.actor.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {t(`roles.${log.actor.role}`)}
          </p>
        </div>
      ),
    },
    {
      key: "action",
      header: t("admin.auditPage.action"),
      cell: (log) => (
        <StatusBadge
          status={log.action}
          label={t(`audit.actions.${log.action}`)}
        />
      ),
    },
    {
      key: "entity",
      header: t("admin.auditPage.entity"),
      className: "hidden md:table-cell",
      cell: (log) => t.dynamic(`audit.entities.${log.entity}`),
    },
    {
      key: "details",
      header: <span className="sr-only">{t("admin.auditPage.details")}</span>,
      className: "text-right",
      cell: (log) => <AuditChangeDialog log={log} />,
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        rows={logs}
        rowKey={(log) => log.id}
        caption={t("admin.auditPage.caption")}
        empty={{
          icon: ScrollTextIcon,
          title: t("admin.auditPage.empty"),
          description: t("admin.auditPage.emptyHint"),
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
