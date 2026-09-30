"use client";

import { ScrollTextIcon } from "lucide-react";
import DataTable, { type Column } from "@/components/ui/data-table";
import StatusBadge from "@/components/ui/status-badge";
import TablePagination from "@/components/ui/table-pagination";
import { useSuspenseAuditLogs } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { AuditLog, AuditLogParams } from "@/types";
import { auditTone, formatDateTime } from "@/utils";
import AuditChangeDialog from "./audit-change-dialog";

interface Props extends AuditLogParams {
  handlePageChange: (page: number) => void;
}

export default function AuditLogTable({ handlePageChange, ...params }: Props) {
  const t = useT();
  const locale = useLocale();

  const { data } = useSuspenseAuditLogs(params);

  const logs = data?.data ?? [];

  const columns: Column<AuditLog>[] = [
    {
      key: "when",
      header: t("admin.auditPage.when"),
      className: "whitespace-nowrap text-muted-foreground",
      cell: (log) => formatDateTime(log.createdAt, locale),
    },
    {
      key: "actor",
      header: t("admin.auditPage.actor"),
      cell: (log) => (
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{log.actor.name}</span>
          <StatusBadge
            status={log.actor.role}
            className="h-5 px-1.5 text-[11px]"
          />
        </span>
      ),
    },
    {
      key: "action",
      header: t("admin.auditPage.action"),
      cell: (log) => (
        <StatusBadge
          status={log.action}
          label={t(`audit.actions.${log.action}`)}
          tone={auditTone(log.action)}
        />
      ),
    },
    {
      key: "entity",
      header: t("admin.auditPage.entity"),
      cell: (log) => (
        <span className="grid leading-tight">
          <span>
            {t.dynamic(`audit.entities.${log.entity}`)}{" "}
            <span className="font-mono text-xs text-muted-foreground">
              {log.entityId.slice(0, 4)}…{log.entityId.slice(-4)}
            </span>
          </span>
          {log.subjectMember && (
            <span className="text-xs text-muted-foreground">
              {log.subjectMember.user.name}
            </span>
          )}
        </span>
      ),
    },
    {
      key: "details",
      header: <span className="sr-only">{t("admin.auditPage.details")}</span>,
      className: "text-right",
      cell: (log) => <AuditChangeDialog log={log} variant="outline" />,
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
