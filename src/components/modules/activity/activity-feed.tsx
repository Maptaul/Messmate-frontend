"use client";

import { HistoryIcon } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";
import StatusBadge from "@/components/ui/status-badge";
import TablePagination from "@/components/ui/table-pagination";
import UserAvatar from "@/components/ui/user-avatar";
import { useSuspenseMessAudit } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";
import type { MessAuditParams } from "@/types";
import { auditTone, formatDateTime } from "@/utils";

interface Props extends MessAuditParams {
  messId: string;
  /** Changes after this were new when the page opened. */
  seenBefore: string | null;
  handlePageChange: (page: number) => void;
}

/** A member's feed: the changes that involve them, new ones marked. */
export default function ActivityFeed({
  messId,
  seenBefore,
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
      <ul className="overflow-hidden rounded-xl border bg-card shadow-1">
        {logs.map((log) => {
          const isNew = !!seenBefore && log.createdAt > seenBefore;
          return (
            <li
              key={log.id}
              className="flex items-center gap-3 border-b px-4 py-3 last:border-0"
            >
              <span
                aria-hidden
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  isNew ? "bg-primary" : "bg-transparent",
                )}
              />
              <UserAvatar name={log.actor.name} className="size-8" />
              <div className="min-w-0 flex-1">
                <p className={cn("leading-snug", isNew && "font-semibold")}>
                  {log.actor.name} · {t(`audit.actions.${log.action}`)}
                  {log.subjectMember && ` — ${log.subjectMember.user.name}`}
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  {formatDateTime(log.createdAt, locale)}
                </p>
              </div>
              <StatusBadge
                status={log.action}
                tone={auditTone(log.action)}
                label={t.dynamic(`audit.entities.${log.entity}`)}
              />
            </li>
          );
        })}
      </ul>
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
