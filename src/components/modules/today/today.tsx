"use client";

import {
  CalendarDaysIcon,
  CreditCardIcon,
  LockIcon,
  ShoppingCartIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/status-badge";
import {
  useGetMe,
  useSuspenseMyBills,
  useSuspenseMyCalendar,
  useSuspenseMyDutyDays,
} from "@/hooks";
import { useLocale, useLocalePath, useT } from "@/i18n/i18n-provider";
import {
  formatBDT,
  formatDate,
  formatDeadline,
  formatLongDate,
  formatMonth,
  formatNumber,
  LATEST_BILL_PARAMS,
  todayInDhaka,
  toNumber,
} from "@/utils";
import TodayActivity from "./today-activity";
import TodayStats from "./today-stats";
import TomorrowMeals from "./tomorrow-meals";

function greetingKey() {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Dhaka",
      hour: "2-digit",
      hourCycle: "h23",
    }).format(new Date()),
  );
  if (hour < 12) return "resident.today.greetMorning" as const;
  if (hour < 17) return "resident.today.greetAfternoon" as const;
  return "resident.today.greetEvening" as const;
}

export default function Today({
  cycleId,
  messId,
}: {
  cycleId: string;
  messId: string;
}) {
  const t = useT();
  const locale = useLocale();
  const href = useLocalePath();
  const { data: me } = useGetMe();
  const { data: calendar } = useSuspenseMyCalendar(cycleId);
  const { data: duty } = useSuspenseMyDutyDays(cycleId);
  const { data: bills } = useSuspenseMyBills(LATEST_BILL_PARAMS);

  const todayDate = todayInDhaka();
  const today = calendar.data.days.find((day) => day.date === todayDate);
  const bill = bills.data[0];
  const due = toNumber(bill?.dueAmount);
  const n = (value: number) => formatNumber(value, locale);

  const turn =
    duty.data.turns.find((entry) => entry.endDate.slice(0, 10) >= todayDate) ??
    null;
  const onDuty = !!turn && turn.startDate.slice(0, 10) <= todayDate;
  const firstName = me?.data.name.split(" ")[0] ?? "";

  return (
    <>
      <div className="flex flex-col gap-1">
        <p className="micro text-muted-foreground" suppressHydrationWarning>
          {t(greetingKey(), { name: firstName })} ·{" "}
          {formatLongDate(new Date(), locale)}
        </p>
        <h1 className="page-title">{t("resident.today.title")}</h1>
        <p className="text-muted-foreground">
          {t("resident.today.description")}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <TomorrowMeals cycleId={cycleId} />

        <div className="flex flex-col gap-4">
          {today && (
            <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-semibold">{t("resident.today.meals")}</h2>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(today.date, locale)} ·{" "}
                    {today.isLocked
                      ? t("resident.today.lockedNote")
                      : t("resident.today.changeUntil", {
                          time: formatDeadline(today.deadline, locale),
                        })}
                  </p>
                </div>
                {today.isLocked && (
                  <span className="tone-n flex h-6 shrink-0 items-center gap-1 rounded-full border px-2 text-xs font-medium">
                    <LockIcon className="size-3" />
                    {t("resident.today.locked")}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(["lunch", "dinner"] as const).map((meal) => (
                  <div key={meal} className="rounded-xl bg-muted px-3 py-2.5">
                    <p className="text-xs text-muted-foreground">
                      {t(`resident.today.${meal}`)}
                    </p>
                    <p className="text-lg font-semibold tabular-nums">
                      {today[meal] === 0
                        ? t("resident.today.notCounted")
                        : n(today[meal])}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <StatusBadge
                  status="PLANNED"
                  tone={today.isPlanned ? "tone-g" : "tone-n"}
                  label={
                    today.isPlanned
                      ? t("resident.today.planned")
                      : t("resident.today.fromDefault")
                  }
                />
                <Button
                  variant="outline"
                  size="sm"
                  render={<Link href={href("/dashboard/meal-plan")} />}
                  nativeButton={false}
                >
                  <CalendarDaysIcon />
                  {t("resident.today.planLink")}
                </Button>
              </div>
            </div>
          )}

          {bill && due > 0 && (
            <div className="tone-a flex flex-col gap-2 rounded-xl border bg-card p-4 shadow-1">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-semibold text-foreground">
                  {t("resident.today.unpaid")}
                </h2>
                <StatusBadge status={bill.status} />
              </div>
              <p className="text-[13px] text-muted-foreground">
                {formatMonth(bill.cycle.year, bill.cycle.month, locale)} ·{" "}
                {bill.cycle.mess.name}
              </p>
              <p className="text-[26px] font-bold text-foreground tabular-nums">
                {formatBDT(due, locale)}
              </p>
              <Button
                size="lg"
                render={<Link href={href("/dashboard/bills")} />}
                nativeButton={false}
              >
                <CreditCardIcon />
                {t("resident.today.payNow")}
              </Button>
            </div>
          )}

          <div className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-1">
            <span className="tone-a grid size-9 shrink-0 place-items-center rounded-lg">
              <ShoppingCartIcon className="size-4" />
            </span>
            <div>
              <h2 className="font-semibold">{t("resident.today.myDuty")}</h2>
              <p className="text-[13px] text-muted-foreground">
                {turn
                  ? t(
                      onDuty
                        ? "resident.today.dutyNow"
                        : "resident.today.dutyNext",
                      {
                        start: formatDate(turn.startDate, locale),
                        end: formatDate(turn.endDate, locale),
                        days: n(turn.days),
                      },
                    )
                  : duty.data.turns.length > 0
                    ? t("resident.today.dutyDone")
                    : t("resident.today.dutyNone")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <TodayStats cycleId={cycleId} memberId={calendar.data.memberId} />
      <TodayActivity messId={messId} />
    </>
  );
}
