"use client";

import { SaveIcon, WandSparklesIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import DataTable, { type Column } from "@/components/ui/data-table";
import MealStepper from "@/components/ui/meal-stepper";
import { Spinner } from "@/components/ui/spinner";
import UserAvatar from "@/components/ui/user-avatar";
import { useAddDailyMeals, useApplyPlan } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { MealCounts, MealEntry, MembershipStatus } from "@/types";
import { formatDate, formatNumber, getErrorMessage } from "@/utils";
import MealEntryActions from "./meal-entry-actions";

interface Member {
  memberId: string;
  name: string;
  email: string;
  status: MembershipStatus;
}

/** One day's meals for everyone: nudge the counts, then save. */
export default function MealRegisterGrid({
  cycleId,
  date,
  members,
  entries,
  locked,
}: {
  cycleId: string;
  date: string;
  members: Member[];
  entries: MealEntry[];
  locked: boolean;
}) {
  const t = useT();
  const locale = useLocale();

  const { mutate: addDailyMeals, isPending: saving } = useAddDailyMeals();
  const { mutate: applyPlan, isPending: applying } = useApplyPlan();

  const saved = new Map(entries.map((entry) => [entry.member.id, entry]));

  const [counts, setCounts] = useState<Record<string, MealCounts>>(() => {
    return Object.fromEntries(
      members.map(({ memberId }) => [
        memberId,
        {
          lunch: saved.get(memberId)?.lunch ?? 0,
          dinner: saved.get(memberId)?.dinner ?? 0,
        },
      ]),
    );
  });

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

  const columns: Column<Member>[] = [
    {
      key: "member",
      header: t("manager.meals.member"),
      cell: (member) => (
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar name={member.name} />
          <div className="min-w-0">
            <p className="truncate font-medium">{member.name}</p>
            <p className="hidden truncate text-xs text-muted-foreground sm:block">
              {member.email}
            </p>
          </div>
        </div>
      ),
    },
    ...(["lunch", "dinner"] as const).map(
      (meal): Column<Member> => ({
        key: meal,
        header: t(`manager.meals.${meal}`),
        cell: (member) => (
          <MealStepper
            value={counts[member.memberId]?.[meal] ?? 0}
            disabled={locked || saving || member.status !== "ACTIVE"}
            onChange={(value) => setMeal(member.memberId, meal, value)}
            decreaseLabel={t("manager.meals.decrease", {
              name: member.name,
              meal: t(`manager.meals.${meal}`),
            })}
            increaseLabel={t("manager.meals.increase", {
              name: member.name,
              meal: t(`manager.meals.${meal}`),
            })}
          />
        ),
      }),
    ),
    {
      key: "actions",
      header: <span className="sr-only">{t("manager.meals.actions")}</span>,
      className: "text-right",
      cell: (member) => {
        const entry = saved.get(member.memberId);
        return entry && !locked ? (
          <MealEntryActions entry={entry} name={member.name} />
        ) : null;
      },
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        rows={members}
        rowKey={(member) => member.memberId}
        caption={t("manager.meals.title")}
        empty={{
          title: t("manager.meals.empty"),
          description: t("manager.meals.emptyHint"),
        }}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {t("manager.meals.total")}:{" "}
          <span className="font-semibold text-foreground tabular-nums">
            {formatNumber(dayTotal, locale)}
          </span>
        </p>
        {!locked && (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={applying || saving}
              title={t("manager.meals.applyPlanHint")}
              onClick={handleApplyPlan}
            >
              {applying ? <Spinner /> : <WandSparklesIcon />}
              {t("manager.meals.applyPlan")}
            </Button>
            <Button
              type="button"
              disabled={saving || applying || members.length === 0}
              onClick={handleSave}
            >
              {saving ? <Spinner /> : <SaveIcon />}
              {saving ? t("manager.meals.saving") : t("manager.meals.save")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
