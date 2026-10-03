"use client";

import { BellIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { initialsOf } from "@/components/ui/user-avatar";
import { useActivityUnread, useMessAudit } from "@/hooks";
import { useLocale, useLocalePath, useT } from "@/i18n/i18n-provider";
import type { UserRole } from "@/types";
import { formatNumber, formatRelative, RECENT_ACTIVITY_PARAMS } from "@/utils";

export default function ActivityBell({
  role,
  messId,
}: {
  role: UserRole;
  messId: string;
}) {
  const t = useT();
  const locale = useLocale();
  const href = useLocalePath();
  const [open, setOpen] = useState(false);

  const { data } = useActivityUnread(messId);

  const unread = data?.data.unread ?? 0;
  const unreadLabel = t("shell.unread", {
    count: formatNumber(unread, locale),
  });
  const path =
    role === "MESS_MANAGER" ? "/manager/activity" : "/dashboard/activity";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative text-foreground-2"
            aria-label={
              unread > 0
                ? `${t("activityBell.label")}, ${unreadLabel}`
                : t("activityBell.label")
            }
          />
        }
      >
        <BellIcon />
        {unread > 0 && (
          <span className="absolute top-0.5 right-px grid h-4 min-w-4 place-items-center rounded-full border-2 border-background bg-destructive px-1 font-mono text-[10px] leading-none font-semibold text-white">
            {unread > 99 ? "99+" : formatNumber(unread, locale)}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[min(380px,calc(100vw-2rem))] gap-0 overflow-hidden rounded-lg p-0 shadow-3"
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="text-sm font-semibold">
            {t("activityBell.label")}
          </span>
          <span className="text-xs text-muted-foreground">{unreadLabel}</span>
        </div>
        <BellFeed messId={messId} unread={unread} />
        <Link
          href={href(path)}
          onClick={() => setOpen(false)}
          className="block p-2.5 text-center text-[13px] font-medium text-primary hover:underline"
        >
          {t("shell.seeAll")}
        </Link>
      </PopoverContent>
    </Popover>
  );
}

// Only mounted while the panel is open, so the server render never creates
// the overview's recent-activity query before the page hydrates it.
function BellFeed({ messId, unread }: { messId: string; unread: number }) {
  const t = useT();
  const locale = useLocale();
  const { data } = useMessAudit(messId, RECENT_ACTIVITY_PARAMS);
  const logs = data?.data ?? [];

  if (logs.length === 0) {
    return (
      <p className="px-4 py-6 text-center text-muted-foreground">
        {t("shell.noActivity")}
      </p>
    );
  }

  return logs.map((log, index) => (
    <div key={log.id} className="flex items-start gap-2.5 border-b px-4 py-2.5">
      <span className="grid size-6.5 shrink-0 place-items-center rounded-full bg-accent text-[10px] font-semibold text-foreground-2">
        {initialsOf(log.actor.name)}
      </span>
      <span className="grid flex-1 gap-0.5">
        <span className="text-[13px] leading-snug">
          <span className="font-medium">{log.actor.name}</span> ·{" "}
          {t(`audit.actions.${log.action}`)}
          {log.subjectMember && ` - ${log.subjectMember.user.name}`}
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">
          {formatRelative(log.createdAt, locale)}
        </span>
      </span>
      {index < unread && (
        <span className="mt-1.5 size-1.75 shrink-0 rounded-full bg-primary" />
      )}
    </div>
  ));
}
