"use client";

import Link from "next/link";
import Panel from "@/components/ui/panel";
import UserAvatar from "@/components/ui/user-avatar";
import { useSuspenseMessAudit } from "@/hooks";
import { useLocale, useLocalePath, useT } from "@/i18n/i18n-provider";
import { formatRelative, RECENT_ACTIVITY_PARAMS } from "@/utils";

/** The latest changes that involve this member (the API narrows the feed). */
export default function TodayActivity({ messId }: { messId: string }) {
  const t = useT();
  const locale = useLocale();
  const href = useLocalePath();

  const { data } = useSuspenseMessAudit(messId, RECENT_ACTIVITY_PARAMS);

  return (
    <Panel
      flush
      title={t("resident.today.recent")}
      action={
        <Link
          href={href("/dashboard/activity")}
          className="text-[13px] font-medium text-primary hover:underline"
        >
          {t("shell.seeAll")}
        </Link>
      }
    >
      {data.data.length === 0 ? (
        <p className="px-5 py-6 text-muted-foreground">
          {t("resident.today.noActivity")}
        </p>
      ) : (
        <ul>
          {data.data.map((log) => (
            <li
              key={log.id}
              className="flex items-start gap-2.5 border-b px-5 py-2.5 last:border-0"
            >
              <UserAvatar name={log.actor.name} className="size-7" />
              <div className="flex-1">
                <p className="leading-snug">
                  {log.actor.name} · {t(`audit.actions.${log.action}`)}
                  {log.subjectMember && ` — ${log.subjectMember.user.name}`}
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  {formatRelative(log.createdAt, locale)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
