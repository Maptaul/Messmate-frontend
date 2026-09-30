"use client";

import {
  BanknoteIcon,
  CalendarCheck2Icon,
  LockIcon,
  ShoppingCartIcon,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StatCard from "@/components/ui/stat-card";
import {
  useSuspenseMyBills,
  useSuspenseMyCalendar,
  useSuspenseMyDutyDays,
} from "@/hooks";
import { useLocale, useLocalePath, useT } from "@/i18n/i18n-provider";
import {
  formatBDT,
  formatDate,
  formatDeadline,
  formatMonth,
  formatNumber,
  LATEST_BILL_PARAMS,
  todayInDhaka,
  toNumber,
} from "@/utils";

export default function Today({ cycleId }: { cycleId: string }) {
  const t = useT();
  const locale = useLocale();
  const href = useLocalePath();
  const { data: calendar } = useSuspenseMyCalendar(cycleId);
  const { data: duty } = useSuspenseMyDutyDays(cycleId);
  const { data: bills } = useSuspenseMyBills(LATEST_BILL_PARAMS);

  const today = calendar.data.days.find((day) => day.date === todayInDhaka());
  const bill = bills.data[0];
  const due = toNumber(bill?.dueAmount);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label={t("resident.today.plannedThisMonth")}
          value={formatNumber(calendar.data.plannedMeals, locale)}
        />
        <StatCard
          label={t("resident.today.dutyTitle")}
          value={t("resident.today.dutyDays", {
            count: formatNumber(duty.data.totalDays, locale),
          })}
        />
        <StatCard
          label={t("resident.today.billTitle")}
          value={
            bill
              ? due > 0
                ? formatBDT(due, locale)
                : t("resident.today.billSettled")
              : "—"
          }
          hint={
            bill
              ? formatMonth(bill.cycle.year, bill.cycle.month, locale)
              : t("resident.today.billNone")
          }
          valueClassName={due > 0 ? "text-(--tone-a-fg)" : undefined}
        />
      </div>

      {today && (
        <Card>
          <CardHeader>
            <CardTitle>{t("resident.today.meals")}</CardTitle>
            <CardDescription>
              {formatDate(today.date, locale)}
              {" · "}
              {today.isLocked
                ? t("resident.today.lockedNote")
                : t("resident.today.changeUntil", {
                    time: formatDeadline(today.deadline, locale),
                  })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {(["lunch", "dinner"] as const).map((meal) => (
                <div
                  key={meal}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <span className="text-sm text-muted-foreground">
                    {t(`resident.today.${meal}`)}
                  </span>
                  <span className="text-2xl font-semibold tabular-nums">
                    {today[meal] === 0 ? (
                      <span className="text-base font-normal text-muted-foreground">
                        {t("resident.today.notCounted")}
                      </span>
                    ) : (
                      formatNumber(today[meal], locale)
                    )}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline">
                {today.isPlanned
                  ? t("resident.today.planned")
                  : t("resident.today.fromDefault")}
              </Badge>
              {today.isLocked && (
                <Badge variant="outline" className="gap-1">
                  <LockIcon className="size-3" aria-hidden />
                  {t("resident.today.locked")}
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                render={<Link href={href("/dashboard/meal-plan")} />}
                nativeButton={false}
              >
                {t("resident.today.planLink")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("resident.today.dutyTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            {duty.data.turns.length ? (
              <ul className="space-y-2 text-sm">
                {duty.data.turns.map((turn) => (
                  <li key={turn.startDate} className="rounded-lg border p-3">
                    <p className="font-medium">
                      {t("resident.today.dutyTurn", {
                        start: formatDate(turn.startDate, locale),
                        end: formatDate(turn.endDate, locale),
                        days: formatNumber(turn.days, locale),
                      })}
                    </p>
                    {turn.note && (
                      <p className="text-xs text-muted-foreground">
                        {turn.note}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t("resident.today.dutyNone")}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("resident.today.billTitle")}</CardTitle>
            <CardDescription>
              {bill
                ? formatMonth(bill.cycle.year, bill.cycle.month, locale)
                : t("resident.today.billNone")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {bill && (
              <p className="text-2xl font-semibold tabular-nums">
                {due > 0
                  ? t("resident.today.billDue", {
                      amount: formatBDT(due, locale),
                    })
                  : t("resident.today.billSettled")}
              </p>
            )}
            {due > 0 && (
              <Button
                size="sm"
                render={<Link href={href("/dashboard/bills")} />}
                nativeButton={false}
              >
                {t("resident.today.payNow")}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
