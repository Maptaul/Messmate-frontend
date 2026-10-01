"use client";

import {
  CheckIcon,
  ClockIcon,
  LockIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import MealStepper from "@/components/ui/meal-stepper";
import { Spinner } from "@/components/ui/spinner";
import { useSetMealPlan, useSuspenseMyCalendar } from "@/hooks";
import usePlanCutoff from "@/hooks/plan-cutoff.hook";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { dayInDhaka, formatLongDate, getErrorMessage } from "@/utils";

/** Tomorrow's lunch and dinner, editable until 11 PM tonight. */
export default function TomorrowMeals({ cycleId }: { cycleId: string }) {
  const t = useT();
  const locale = useLocale();
  const cutoff = usePlanCutoff();

  const { data } = useSuspenseMyCalendar(cycleId);
  const { mutate: savePlan, isPending } = useSetMealPlan();

  const date = dayInDhaka(1);
  const day = data.data.days.find((entry) => entry.date === date);
  const [draft, setDraft] = useState<{ lunch: number; dinner: number } | null>(
    null,
  );

  const locked = !day || day.isLocked || !!cutoff?.locked;
  const counts = draft ?? { lunch: day?.lunch ?? 0, dinner: day?.dinner ?? 0 };
  const dirty =
    !!day && (counts.lunch !== day.lunch || counts.dinner !== day.dinner);

  const handleSave = () => {
    savePlan(
      { cycleId, days: [{ date, ...counts }] },
      {
        onSuccess: () => {
          toast.success(t("resident.today.savedToast"));
          setDraft(null);
        },
        onError: (err) => {
          toast.error(t.dynamic(getErrorMessage(err)));
          setDraft(null);
        },
      },
    );
  };

  return (
    <div className="flex flex-col rounded-xl border bg-card shadow-1">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b px-5 py-4">
        <div>
          <h2 className="font-semibold">{t("resident.today.tomorrow")}</h2>
          <p className="text-xs text-muted-foreground">
            {formatLongDate(`${date}T00:00:00+06:00`, locale)}
          </p>
        </div>
        {day &&
          cutoff &&
          (locked ? (
            <span className="tone-n flex h-6 items-center gap-1.5 rounded-full border px-2 text-xs font-medium">
              <LockIcon className="size-3.5" />
              {t("resident.today.lockedChip")}
            </span>
          ) : (
            <span className="tone-a flex h-6 items-center gap-1.5 rounded-full border px-2 text-xs font-medium">
              <ClockIcon className="size-3.5" />
              {t("resident.today.locksAt", { time: cutoff.time })}
            </span>
          ))}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        {!day ? (
          <p className="text-muted-foreground">
            {t("resident.today.nextMonth")}
          </p>
        ) : locked ? (
          <div className="flex items-center gap-3 rounded-xl bg-muted p-4">
            <span className="grid size-9 place-items-center rounded-lg bg-background">
              <LockIcon className="size-4 text-muted-foreground" />
            </span>
            <div>
              <p className="font-medium">
                {t("resident.today.tomorrowLocked")}
              </p>
              <p className="text-[13px] text-muted-foreground">
                {t("resident.today.lockedHelp")}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              {(["lunch", "dinner"] as const).map((meal) => {
                const Icon = meal === "lunch" ? SunIcon : MoonIcon;
                const label = t(`resident.today.${meal}`);
                return (
                  <div
                    key={meal}
                    className="flex flex-col gap-3 rounded-xl bg-muted p-4"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <Icon className="size-4 text-muted-foreground" />
                      {label}
                    </span>
                    <MealStepper
                      size="lg"
                      className="w-full justify-between bg-background"
                      value={counts[meal]}
                      onChange={(value) =>
                        setDraft({ ...counts, [meal]: value })
                      }
                      decreaseLabel={t("resident.today.less", { meal: label })}
                      increaseLabel={t("resident.today.more", { meal: label })}
                    />
                  </div>
                );
              })}
            </div>
            <div className="mt-auto flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                {dirty ? (
                  t("resident.today.unsaved")
                ) : (
                  <>
                    <CheckIcon className="size-3.5" />
                    {t("resident.today.saved")}
                  </>
                )}
              </span>
              <Button
                size="lg"
                disabled={!dirty || isPending}
                onClick={handleSave}
              >
                {isPending && <Spinner />}
                {isPending
                  ? t("resident.today.saving")
                  : t("resident.today.save")}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
