"use client";

import {
  CircleCheckIcon,
  ClipboardCheckIcon,
  MailIcon,
  UsersIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import DataTable, { type Column } from "@/components/ui/data-table";
import Panel from "@/components/ui/panel";
import { Spinner } from "@/components/ui/spinner";
import StatusBadge from "@/components/ui/status-badge";
import UserAvatar from "@/components/ui/user-avatar";
import { useApplyPlan, useSuspenseCycleCalendar } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";
import type { ApplyPlanResult, CycleCalendarDay } from "@/types";
import {
  formatDate,
  formatMonth,
  formatNumber,
  getErrorMessage,
  todayInDhaka,
} from "@/utils";

type Row = CycleCalendarDay["members"][number];

export default function HeadcountTable({
  cycleId,
  year,
  month,
  date,
  started,
  onPick,
}: {
  cycleId: string;
  year: number;
  month: number;
  date: string;
  /** A day's plan can go into the register once the day has begun. */
  started: boolean;
  onPick: (date: string) => void;
}) {
  const t = useT();
  const locale = useLocale();
  const n = (value: number) => formatNumber(value, locale);
  const [confirm, setConfirm] = useState(false);
  const [applied, setApplied] = useState<ApplyPlanResult | null>(null);

  // The whole month once: the strip and the chosen day both read it.
  const { data } = useSuspenseCycleCalendar(cycleId);
  const { mutate: applyPlan, isPending } = useApplyPlan();

  // The API leaves out days nobody eats, so "no day" simply means zero.
  const byDate = new Map(
    data.data.days.map((entry) => [entry.date.slice(0, 10), entry]),
  );
  const day = byDate.get(date);
  const lunch = day?.lunch ?? 0;
  const dinner = day?.dinner ?? 0;
  const result = applied?.date.startsWith(date) ? applied : null;

  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const prefix = `${year}-${String(month).padStart(2, "0")}-`;
  const strip = Array.from({ length: lastDay }, (_, index) => {
    const key = `${prefix}${String(index + 1).padStart(2, "0")}`;
    const entry = byDate.get(key);
    return {
      key,
      day: index + 1,
      lunch: entry?.lunch ?? 0,
      dinner: entry?.dinner ?? 0,
    };
  });
  const peak = Math.max(...strip.map((cell) => cell.lunch + cell.dinner), 1);
  const today = todayInDhaka();

  const handleApply = () => {
    applyPlan(
      { cycleId, date },
      {
        onSuccess: (res) => {
          setApplied(res.data);
          toast.success(
            t("manager.headcount.applied", { created: n(res.data.created) }),
          );
          setConfirm(false);
        },
        onError: (err) => {
          toast.error(t.dynamic(getErrorMessage(err)));
          setConfirm(false);
        },
      },
    );
  };

  const columns: Column<Row>[] = [
    {
      key: "member",
      header: t("manager.headcount.member"),
      cell: (row) => (
        <span className="flex items-center gap-2">
          <UserAvatar name={row.name} className="size-7" />
          {row.name}
        </span>
      ),
    },
    {
      key: "lunch",
      header: t("manager.headcount.lunch"),
      className: "text-right font-semibold tabular-nums",
      cell: (row) => n(row.lunch),
    },
    {
      key: "dinner",
      header: t("manager.headcount.dinner"),
      className: "text-right font-semibold tabular-nums",
      cell: (row) => n(row.dinner),
    },
    {
      key: "source",
      header: t("manager.headcount.source"),
      cell: (row) => (
        <span className="flex flex-wrap gap-1.5">
          <StatusBadge status={row.isDefault ? "DEFAULT" : "PLANNED"} />
          {row.lunch + row.dinner === 0 && (
            <StatusBadge
              status="off"
              label={t("manager.headcount.off")}
              tone="tone-r"
            />
          )}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {[
          [t("manager.headcount.lunch"), lunch],
          [t("manager.headcount.dinner"), dinner],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border bg-card p-5 shadow-1">
            <p className="font-medium text-muted-foreground">{label}</p>
            <p className="text-[44px] leading-tight font-bold tabular-nums">
              {n(value as number)}
            </p>
          </div>
        ))}
        <div className="tone-g rounded-xl border bg-primary-tint p-5 text-primary">
          <p className="font-medium">{t("manager.headcount.total")}</p>
          <p className="text-[44px] leading-tight font-bold tabular-nums">
            {n(lunch + dinner)}
          </p>
        </div>
      </div>

      <Panel
        flush
        title={t("manager.headcount.whoEats")}
        action={
          <span
            title={started ? undefined : t("manager.headcount.applyFuture")}
          >
            <Button
              disabled={!started || !!result}
              onClick={() => setConfirm(true)}
            >
              <ClipboardCheckIcon />
              {t("manager.headcount.apply")}
            </Button>
          </span>
        }
      >
        {!started && (
          <p className="border-b bg-muted px-4 py-2 text-xs text-muted-foreground">
            {t("manager.headcount.applyFuture")}
          </p>
        )}
        {result && (
          <output className="tone-g flex items-center gap-2 border-b px-4 py-2.5">
            <CircleCheckIcon className="size-4" />
            {t("manager.headcount.applyDone", {
              created: n(result.created),
              defaults: n(result.fromDefaults),
              skipped: n(result.skipped),
            })}
          </output>
        )}
        <DataTable
          bare
          columns={columns}
          rows={day?.members ?? []}
          rowKey={(row) => row.memberId}
          caption={t("manager.headcount.caption")}
          empty={{
            icon: UsersIcon,
            title: t("manager.headcount.empty"),
            description: t("manager.headcount.emptyHint"),
          }}
        />
      </Panel>

      <Panel
        title={t("manager.headcount.strip", {
          month: formatMonth(year, month, locale),
        })}
        description={t("manager.headcount.stripSub")}
        action={
          <div className="flex gap-3.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-[3px] bg-chart-1" />
              {t("manager.headcount.lunch")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-[3px] bg-chart-2" />
              {t("manager.headcount.dinner")}
            </span>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <div
            className="grid min-w-180 items-end gap-1"
            style={{
              gridTemplateColumns: `repeat(${lastDay}, minmax(22px, 1fr))`,
            }}
          >
            {strip.map((cell) => {
              const tip = `${formatDate(cell.key, locale)} — ${t("manager.headcount.lunch")} ${n(cell.lunch)}, ${t("manager.headcount.dinner")} ${n(cell.dinner)}`;
              return (
                <button
                  key={cell.key}
                  type="button"
                  title={tip}
                  aria-label={tip}
                  onClick={() => onPick(cell.key)}
                  className={cn(
                    "flex h-30 flex-col justify-end gap-px rounded-lg border p-0.5",
                    cell.key === date
                      ? "border-ring bg-primary-tint"
                      : "border-transparent hover:bg-accent",
                    cell.key < today && "opacity-55",
                  )}
                >
                  <span
                    className="rounded-t-[3px] bg-chart-2"
                    style={{ height: `${(cell.dinner / peak) * 100}%` }}
                  />
                  <span
                    className="bg-chart-1"
                    style={{ height: `${(cell.lunch / peak) * 100}%` }}
                  />
                </button>
              );
            })}
          </div>
          <div
            className="mt-1 grid min-w-180 gap-1"
            style={{
              gridTemplateColumns: `repeat(${lastDay}, minmax(22px, 1fr))`,
            }}
          >
            {strip.map((cell) => (
              <span
                key={cell.key}
                className={cn(
                  "text-center text-[10px] text-muted-foreground",
                  cell.key === date && "font-bold text-primary",
                )}
              >
                {n(cell.day)}
              </span>
            ))}
          </div>
        </div>
      </Panel>

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <MailIcon className="size-3.5" />
        {t("manager.headcount.email")}
      </p>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("manager.headcount.applyTitle", {
                date: formatDate(date, locale),
              })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("manager.headcount.applyBody")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("manager.headcount.cancel")}
            </AlertDialogCancel>
            <Button onClick={handleApply} disabled={isPending}>
              {isPending && <Spinner />}
              {t("manager.headcount.apply")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
