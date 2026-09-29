"use client";

import { HistoryIcon } from "lucide-react";
import AuditChangeDialog from "@/components/modules/audit-logs/audit-change-dialog";
import DataTable, { type Column } from "@/components/ui/data-table";
import StatusBadge from "@/components/ui/status-badge";
import TablePagination from "@/components/ui/table-pagination";
import { useSuspenseMessAudit } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { AuditLog, MessAuditParams } from "@/types";
import { formatDateTime } from "@/utils";

interface Props extends MessAuditParams {
  messId: string;
  handlePageChange: (page: number) => void;
}

export default function ActivityTable({
  messId,
  handlePageChange,
  ...params
}: Props) {
  const t = useT();
  const locale = useLocale();

  const { data } = useSuspenseMessAudit(messId, params);

  const logs = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;

  const columns: Column<AuditLog>[] = [
    {
      key: "when",
      header: t("activity.when"),
      className: "whitespace-nowrap",
      cell: (log) => formatDateTime(log.createdAt, locale),
    },
    {
      key: "who",
      header: t("activity.who"),
      cell: (log) => log.actor.name,
    },
    {
      key: "action",
      header: t("activity.action"),
      cell: (log) => (
        <StatusBadge
          status={log.action}
          label={t(`audit.actions.${log.action}`)}
        />
      ),
    },
    {
      key: "about",
      header: t("activity.about"),
      className: "hidden md:table-cell",
      cell: (log) => log.subjectMember?.user.name ?? "—",
    },
    {
      key: "details",
      header: <span className="sr-only">{t("activity.details")}</span>,
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
        caption={t("activity.caption")}
        empty={{
          icon: HistoryIcon,
          title: t("activity.empty"),
          description: t("activity.emptyHint"),
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
