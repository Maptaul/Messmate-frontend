"use client";

import { ClockIcon, LockIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSetMealPlan } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { MealCounts as Counts, MyCalendarDay } from "@/types";
import { formatDeadline, formatLongDate, getErrorMessage } from "@/utils";
import MealCounts from "./meal-counts";

export default function MealPlanDayDialog({
  cycleId,
  day,
  defaults,
  onClose,
}: {
  cycleId: string;
  day: MyCalendarDay | null;
  defaults: Counts;
  onClose: () => void;
}) {
  const t = useT();
  const locale = useLocale();
  const [draft, setDraft] = useState<Counts | null>(null);

  const { mutate: savePlan, isPending } = useSetMealPlan();

  const close = () => {
    setDraft(null);
    onClose();
  };

  const save = (counts: Counts) => {
    if (!day) return;
    savePlan(
      { cycleId, days: [{ date: day.date, ...counts }] },
      {
        onSuccess: () => toast.success(t("resident.mealPlan.planSaved")),
        onError: (err) => toast.error(t.dynamic(getErrorMessage(err))),
      },
    );
    // Optimistic: the calendar already shows it; a refused day rolls back.
    close();
  };

  const counts = draft ?? { lunch: day?.lunch ?? 0, dinner: day?.dinner ?? 0 };

  return (
    <Dialog open={!!day} onOpenChange={(open) => !open && close()}>
      <DialogContent className="sm:max-w-md">
        {day && (
          <>
            <DialogHeader>
              <DialogTitle>
                {formatLongDate(`${day.date}T00:00:00+06:00`, locale)}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-1.5">
                {day.isLocked ? (
                  <LockIcon className="size-3.5" />
                ) : (
                  <ClockIcon className="size-3.5" />
                )}
                {t("resident.mealPlan.deadline", {
                  time: formatDeadline(day.deadline, locale),
                })}
              </DialogDescription>
            </DialogHeader>
            {day.isLocked && (
              <p
                role="alert"
                className="tone-n flex items-center gap-2 rounded-xl border px-3 py-2.5"
              >
                <LockIcon className="size-4 shrink-0" />
                {t("resident.mealPlan.dayLocked")}
              </p>
            )}
            <MealCounts
              value={counts}
              onChange={setDraft}
              disabled={day.isLocked || isPending}
            />
            {!day.isLocked && day.isPlanned && (
              <Button
                variant="link"
                className="w-fit px-0"
                onClick={() => save(defaults)}
              >
                {t("resident.mealPlan.backDefault")}
              </Button>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={close}>
                {t("resident.mealPlan.close")}
              </Button>
              {!day.isLocked && (
                <Button
                  disabled={!draft || isPending}
                  onClick={() => save(counts)}
                >
                  {t("resident.mealPlan.savePlan")}
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
