"use client";

import MealStepper from "@/components/ui/meal-stepper";
import { useT } from "@/i18n/i18n-provider";
import type { MealCounts as Counts } from "@/types";

/** Lunch and dinner steppers side by side, as every meal-plan dialog shows them. */
export default function MealCounts({
  value,
  onChange,
  disabled,
}: {
  value: Counts;
  onChange: (value: Counts) => void;
  disabled?: boolean;
}) {
  const t = useT();

  return (
    <div className="grid grid-cols-2 gap-3">
      {(["lunch", "dinner"] as const).map((meal) => {
        const label = t(`resident.mealPlan.${meal}`);
        return (
          <div
            key={meal}
            className="flex flex-col gap-2 rounded-xl bg-muted p-3"
          >
            <span className="font-medium">{label}</span>
            <MealStepper
              size="lg"
              className="w-full justify-between bg-background"
              value={value[meal]}
              disabled={disabled}
              onChange={(next) => onChange({ ...value, [meal]: next })}
              decreaseLabel={t("resident.mealPlan.lessMeal", { meal: label })}
              increaseLabel={t("resident.mealPlan.moreMeal", { meal: label })}
            />
          </div>
        );
      })}
    </div>
  );
}
