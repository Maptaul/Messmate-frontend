"use client";

import { useSuspenseCycleDuties, useSuspenseDutyCalendar } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";
import { formatNumber, todayInDhaka, weekdayNames } from "@/utils";
import { dutyColors } from "./duty-colors";

export default function DutyCalendar({ cycleId }: { cycleId: string }) {
  const t = useT();
  const locale = useLocale();

  const { data } = useSuspenseDutyCalendar(cycleId);
  const { data: duties } = useSuspenseCycleDuties(cycleId);

  const { year, month } = data.data.cycle;
  const colorOf = dutyColors(duties.data);
  const today = todayInDhaka();
  const lead = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const cells = [
    ...Array.from({ length: lead }, () => null),
    ...data.data.days,
  ];
  while (cells.length % 7) cells.push(null);

  return (
    <div className="hidden overflow-hidden rounded-xl border bg-card shadow-1 md:block">
      <div className="grid grid-cols-7 bg-muted">
        {weekdayNames(locale).map((name) => (
          <div
            key={name}
            className="px-2.5 py-2 text-xs font-medium text-muted-foreground"
          >
            {name}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, index) => {
          if (!day) {
            return (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: blank cells have nothing else
                key={index}
                className="min-h-21 border-t border-r bg-muted"
              />
            );
          }
          const isToday = day.date.startsWith(today);
          return (
            <div
              key={day.date}
              className={cn(
                "flex min-h-21 flex-col gap-1.5 border-t border-r p-2",
                isToday && "bg-primary-tint",
              )}
            >
              <span
                className={cn(
                  "text-xs font-medium text-foreground-2",
                  isToday && "font-bold text-primary",
                )}
              >
                {formatNumber(Number(day.date.slice(8, 10)), locale)}
              </span>
              {day.memberId && day.memberName ? (
                <span className="flex w-fit max-w-full items-center gap-1.5 rounded-lg bg-muted px-1.5 py-0.5 text-xs font-medium">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ background: colorOf(day.memberId) }}
                  />
                  <span className="truncate">
                    {day.memberName.split(" ")[0]}
                  </span>
                </span>
              ) : (
                <span className="text-[11px] text-muted-foreground">
                  {t("manager.duty.unassigned")}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
