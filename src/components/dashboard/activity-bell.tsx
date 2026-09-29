"use client";

import { BellIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useActivityUnread } from "@/hooks";
import { useLocale, useLocalePath, useT } from "@/i18n/i18n-provider";
import type { UserRole } from "@/types";
import { formatNumber } from "@/utils";

/** New activity in the mess since the viewer last opened the feed; checked every minute. */
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

  const { data } = useActivityUnread(messId);

  const unread = data?.data.unread ?? 0;
  const path =
    role === "MESS_MANAGER" ? "/manager/activity" : "/dashboard/activity";

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      render={<Link href={href(path)} />}
      nativeButton={false}
      aria-label={
        unread > 0
          ? `${t("activityBell.label")} · ${t("activityBell.unread", { count: formatNumber(unread, locale) })}`
          : t("activityBell.label")
      }
    >
      <BellIcon />
      {unread > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground tabular-nums">
          {unread > 99 ? "99+" : formatNumber(unread, locale)}
        </span>
      )}
    </Button>
  );
}
