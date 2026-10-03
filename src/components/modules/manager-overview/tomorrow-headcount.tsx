"use client";

import { ArrowRightIcon, ChefHatIcon, ClockIcon } from "lucide-react";
import Link from "next/link";
import Panel from "@/components/ui/panel";
import UserAvatar from "@/components/ui/user-avatar";
import { useSuspenseCycleCalendar } from "@/hooks";
import { useLocale, useLocalePath, useT } from "@/i18n/i18n-provider";
import { dayInDhaka, formatLongDate, formatNumber } from "@/utils";

/**
 * Tomorrow's lunch and dinner for the cook, and who changed from their
 * default. When tomorrow falls in the next month there's nothing to count yet.
 */
export default function TomorrowHeadcount({
  cycleId,
  year,
  month,
}: {
  cycleId: string;
  year: number;
  month: number;
}) {
  const t = useT();
  const locale = useLocale();
  const tomorrow = dayInDhaka(1);
  const inCycle = tomorrow.startsWith(
    `${year}-${String(month).padStart(2, "0")}-`,
  );

  return (
    <Panel
      title={t("manager.overview.tomorrow")}
      description={formatLongDate(`${tomorrow}T00:00:00+06:00`, locale)}
      icon={<ChefHatIcon className="size-4 text-primary" />}
      action={
        <span className="tone-a flex h-6 items-center gap-1.5 rounded-full border px-2 text-xs font-medium">
          <ClockIcon className="size-3.5" />
          {t("manager.overview.locksAt")}
        </span>
      }
    >
      {inCycle ? (
        <Headcount cycleId={cycleId} date={tomorrow} />
      ) : (
        <p className="text-muted-foreground">
          {t("manager.overview.nextMonth")}
        </p>
      )}
    </Panel>
  );
}

function Headcount({ cycleId, date }: { cycleId: string; date: string }) {
  const t = useT();
  const locale = useLocale();
  const href = useLocalePath();
  const n = (value: number) => formatNumber(value, locale);

  const { data } = useSuspenseCycleCalendar(cycleId, date);
  const day = data.data.days.find((entry) => entry.date.startsWith(date));
  const lunch = day?.lunch ?? 0;
  const dinner = day?.dinner ?? 0;
  const changed = day?.members.filter((member) => !member.isDefault) ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          [t("manager.overview.lunch"), lunch],
          [t("manager.overview.dinner"), dinner],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-muted p-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-[28px] font-bold tabular-nums">
              {n(value as number)}
            </p>
          </div>
        ))}
        <div className="rounded-xl bg-primary-tint p-3 text-primary">
          <p className="text-xs">{t("manager.overview.total")}</p>
          <p className="text-[28px] font-bold tabular-nums">
            {n(lunch + dinner)}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-medium text-muted-foreground">
          {t("manager.overview.changes")}
        </p>
        {changed.length === 0 ? (
          <p>{t("manager.overview.noChanges")}</p>
        ) : (
          changed.map((member) => (
            <p key={member.memberId} className="flex items-center gap-2">
              <UserAvatar name={member.name} className="size-6" />
              {member.name}:{" "}
              {member.lunch + member.dinner === 0
                ? t("manager.overview.off")
                : t("manager.overview.mealsOf", {
                    lunch: n(member.lunch),
                    dinner: n(member.dinner),
                  })}
            </p>
          ))
        )}
      </div>
      <Link
        href={href("/manager/headcount")}
        className="flex w-fit items-center gap-1.5 font-medium text-primary hover:underline"
      >
        {t("manager.overview.fullHeadcount")}
        <ArrowRightIcon className="size-4" />
      </Link>
    </div>
  );
}
