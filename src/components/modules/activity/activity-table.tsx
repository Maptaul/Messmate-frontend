"use client";

import { HistoryIcon } from "lucide-react";
import AuditChangeDialog from "@/components/modules/audit-logs/audit-change-dialog";
import EmptyState from "@/components/ui/empty-state";
import StatusBadge from "@/components/ui/status-badge";
import TablePagination from "@/components/ui/table-pagination";
import { useSuspenseMessAudit } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { MessAuditParams } from "@/types";
import { auditTone, formatDateTime, formatRelative } from "@/utils";

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

  if (logs.length === 0) {
    return (
      <EmptyState
        icon={HistoryIcon}
        title={t("activity.empty")}
        description={t("activity.emptyHint")}
      />
    );
  }

  return (
    <>
      <ol
        className="relative flex flex-col pl-5"
        aria-label={t("activity.caption")}
      >
        <span
          aria-hidden
          className="absolute top-2 bottom-2 left-1.25 w-0.5 bg-border"
        />
        {logs.map((log) => {
          const tone = auditTone(log.action);
          return (
            <li key={log.id} className="relative py-2.5">
              <span
                aria-hidden
                className="absolute top-4 -left-4.75 size-2.5 rounded-full border-2 bg-card"
                style={{
                  borderColor:
                    tone === "tone-n"
                      ? "var(--muted-foreground)"
                      : `var(--${tone}-fg)`,
                }}
              />
              <div className="flex flex-col gap-1.5 rounded-xl border bg-card px-3.5 py-3 shadow-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{log.actor.name}</span>
                  <StatusBadge
                    status={log.action}
                    tone={tone}
                    label={t(`audit.actions.${log.action}`)}
                  />
                  <time
                    dateTime={log.createdAt}
                    title={formatDateTime(log.createdAt, locale)}
                    className="ml-auto text-xs text-muted-foreground"
                  >
                    {formatRelative(log.createdAt, locale)}
                  </time>
                </div>
                <p className="text-muted-foreground">
                  {[
                    log.subjectMember?.user.name,
                    t.dynamic(`audit.entities.${log.entity}`),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <AuditChangeDialog log={log} variant="link" />
              </div>
            </li>
          );
        })}
      </ol>
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
