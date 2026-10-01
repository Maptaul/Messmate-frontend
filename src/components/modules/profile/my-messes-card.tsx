"use client";

import Panel from "@/components/ui/panel";
import StatusBadge from "@/components/ui/status-badge";
import { useSuspenseMyMemberships } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { formatDate } from "@/utils";

/** Every mess this person belongs to, or used to. */
export default function MyMessesCard() {
  const t = useT();
  const locale = useLocale();
  const { data } = useSuspenseMyMemberships();

  return (
    <Panel flush title={t("profile.myMesses")}>
      {data.data.length === 0 ? (
        <p className="px-5 py-4 text-[13px] text-muted-foreground">
          {t("profile.noMesses")}
        </p>
      ) : (
        <ul className="max-h-80 overflow-y-auto">
          {data.data.map((membership) => (
            <li
              key={membership.id}
              className="flex items-center justify-between gap-3 border-b px-5 py-2.5 last:border-0"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{membership.mess.name}</p>
                <p className="text-xs text-muted-foreground">
                  {t("profile.joined", {
                    date: formatDate(membership.joinedAt, locale),
                  })}
                </p>
              </div>
              <StatusBadge status={membership.status} />
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
