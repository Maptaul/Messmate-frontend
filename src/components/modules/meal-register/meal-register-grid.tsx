"use client";

import { WandSparklesIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import MealStepper from "@/components/ui/meal-stepper";
import { Spinner } from "@/components/ui/spinner";
import StatusBadge from "@/components/ui/status-badge";
import UserAvatar from "@/components/ui/user-avatar";
import { useAddDailyMeals, useApplyPlan } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { MealCounts, MealEntry, MembershipStatus } from "@/types";
import {
  formatDate,
  formatLongDate,
  formatNumber,
  getErrorMessage,
} from "@/utils";
import MealEntryActions from "./meal-entry-actions";

interface Member {
  memberId: string;
  name: string;
  email: string;
  status: MembershipStatus;
}

/**
 * One day's meals for everyone: nudge the counts, then save. A member who
 * has left keeps their saved row (to correct or delete) but can't be changed.
 */
export default function MealRegisterGrid({
  cycleId,
  year,
  month,
  date,
  members,
  entries,
  locked,
  onDateChange,
}: {
  cycleId: string;
  year: number;
  month: number;
  date: string;
  members: Member[];
  entries: MealEntry[];
  locked: boolean;
  onDateChange: (date: string) => void;
}) {
  const t = useT();
  const locale = useLocale();

  const { mutate: addDailyMeals, isPending: saving } = useAddDailyMeals();
  const { mutate: applyPlan, isPending: applying } = useApplyPlan();

  const saved = new Map(entries.map((entry) => [entry.member.id, entry]));
  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  const last = new Date(Date.UTC(year, month, 0)).getUTCDate();

  const [counts, setCounts] = useState<Record<string, MealCounts>>(() =>
    Object.fromEntries(
      members.map(({ memberId }) => [
        memberId,
        {
          lunch: saved.get(memberId)?.lunch ?? 0,
          dinner: saved.get(memberId)?.dinner ?? 0,
        },
      ]),
    ),
  );

  const setMeal = (memberId: string, meal: keyof MealCounts, value: number) =>
    setCounts((current) => ({
      ...current,
      [memberId]: { ...current[memberId], [meal]: value },
    }));

  const dayTotal = members.reduce(
    (sum, { memberId }) =>
      sum + (counts[memberId]?.lunch ?? 0) + (counts[memberId]?.dinner ?? 0),
    0,
  );

  const handleSave = () => {
    addDailyMeals(
      {
        cycleId,
        date,
        // Members with nothing eaten and no record yet stay out of the register;
        // a former member's entry is only changed through its own row actions.
        entries: members
          .filter(
            ({ memberId, status }) =>
              status === "ACTIVE" &&
              (saved.has(memberId) ||
                counts[memberId].lunch + counts[memberId].dinner > 0),
          )
          .map(({ memberId }) => ({ memberId, ...counts[memberId] })),
      },
      {
        onSuccess: () => {
          toast.success(
            t("toast.mealsSaved", { date: formatDate(date, locale) }),
          );
        },
        onError: (err) => {
          toast.error(t.dynamic(getErrorMessage(err)));
        },
      },
    );
  };

  const handleApplyPlan = () => {
    applyPlan(
      { cycleId, date },
      {
        onSuccess: (res) => {
          toast.success(
            t("toast.planApplied", {
              created: res.data.created,
              fromDefaults: res.data.fromDefaults,
            }),
          );
        },
        onError: (err) => {
          toast.error(t.dynamic(getErrorMessage(err)));
        },
      },
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-1">
      <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3.5">
        <div className="flex items-center gap-2">
          <label htmlFor="register-date" className="font-medium">
            {t("manager.meals.date")}
          </label>
          <Input
            id="register-date"
            type="date"
            className="w-40"
            min={`${prefix}-01`}
            max={`${prefix}-${String(last).padStart(2, "0")}`}
            value={date}
            onChange={(event) =>
              event.target.value && onDateChange(event.target.value)
            }
          />
        </div>
        <span className="text-muted-foreground">
          {formatLongDate(`${date}T00:00:00+06:00`, locale)}
        </span>
        <div className="flex-1" />
        {!locked && (
          <Button
            variant="outline"
            disabled={applying || saving}
            title={t("manager.meals.applyPlanHint")}
            onClick={handleApplyPlan}
          >
            {applying ? <Spinner /> : <WandSparklesIcon />}
            {t("manager.meals.applyPlan")}
          </Button>
        )}
      </div>

      {members.length === 0 ? (
        <EmptyState
          className="m-4"
          icon={WandSparklesIcon}
          title={t("manager.meals.empty")}
          description={t("manager.meals.emptyHint")}
        />
      ) : (
        <ul>
          {members.map((member) => {
            const left = member.status !== "ACTIVE";
            const entry = saved.get(member.memberId);
            const value = counts[member.memberId] ?? { lunch: 0, dinner: 0 };
            const disabled = locked || saving || left;
            return (
              <li
                key={member.memberId}
                className="flex flex-wrap items-center gap-3 border-b px-4 py-2.5"
              >
                <span className="flex min-w-0 flex-[1_1_160px] items-center gap-2">
                  <UserAvatar name={member.name} className="size-7" />
                  <span className="grid min-w-0 leading-tight">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="truncate">{member.name}</span>
                      {left && (
                        <StatusBadge
                          status="LEFT"
                          label={t("manager.meals.left")}
                          className="h-5 px-1.5 text-[11px]"
                        />
                      )}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {member.email}
                    </span>
                  </span>
                </span>
                <span
                  className={`flex flex-wrap items-end gap-2.5 ${left ? "opacity-55" : ""}`}
                >
                  {(["lunch", "dinner"] as const).map((meal) => (
                    <span key={meal} className="flex flex-col gap-0.5">
                      <span className="text-[11px] text-muted-foreground">
                        {t(`manager.meals.${meal}`)}
                      </span>
                      <MealStepper
                        value={value[meal]}
                        disabled={disabled}
                        onChange={(next) =>
                          setMeal(member.memberId, meal, next)
                        }
                        decreaseLabel={t("manager.meals.decrease", {
                          name: member.name,
                          meal: t(`manager.meals.${meal}`),
                        })}
                        increaseLabel={t("manager.meals.increase", {
                          name: member.name,
                          meal: t(`manager.meals.${meal}`),
                        })}
                      />
                    </span>
                  ))}
                  <span className="flex min-w-11 flex-col gap-0.5 text-right">
                    <span className="text-[11px] text-muted-foreground">
                      {t("manager.meals.summaryTotal")}
                    </span>
                    <span className="leading-8 font-semibold tabular-nums">
                      {formatNumber(value.lunch + value.dinner, locale)}
                    </span>
                  </span>
                </span>
                <span className="ml-auto flex min-w-15 justify-end">
                  {entry && !locked && (
                    <MealEntryActions entry={entry} name={member.name} />
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 bg-muted px-4 py-3">
        <span className="grid gap-0.5">
          <span className="font-medium">
            {t("manager.meals.total")}:{" "}
            <b className="tabular-nums">{formatNumber(dayTotal, locale)}</b>
          </span>
          <span className="text-xs text-muted-foreground">
            {t("manager.meals.applyPlanHint")}
          </span>
        </span>
        {!locked && (
          <Button
            disabled={saving || applying || members.length === 0}
            onClick={handleSave}
          >
            {saving && <Spinner />}
            {saving ? t("manager.meals.saving") : t("manager.meals.save")}
          </Button>
        )}
      </div>
    </div>
  );
}
