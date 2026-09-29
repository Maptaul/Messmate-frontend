"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MealStepper from "@/components/ui/meal-stepper";
import { Spinner } from "@/components/ui/spinner";
import { useSetDefaultMeals } from "@/hooks";
import { useT } from "@/i18n/i18n-provider";
import type { MealCounts } from "@/types";
import { getErrorMessage } from "@/utils";

export default function DefaultMealsCard({
  messId,
  defaults,
}: {
  messId: string;
  defaults: MealCounts;
}) {
  const t = useT();
  const [counts, setCounts] = useState(defaults);

  const { mutate: setDefaultMeals, isPending } = useSetDefaultMeals();

  const unchanged =
    counts.lunch === defaults.lunch && counts.dinner === defaults.dinner;

  const handleSave = () => {
    setDefaultMeals(
      { messId, ...counts },
      {
        onSuccess: () => {
          toast.success(t("toast.defaultsSaved"));
        },
        onError: (err) => {
          toast.error(t.dynamic(getErrorMessage(err)));
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("resident.mealPlan.defaultsTitle")}</CardTitle>
        <CardDescription>{t("resident.mealPlan.defaultsBody")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-x-8 gap-y-3">
        {(["lunch", "dinner"] as const).map((meal) => (
          <div key={meal} className="flex items-center gap-3">
            <span className="w-16 text-sm">
              {t(`resident.mealPlan.${meal}`)}
            </span>
            <MealStepper
              value={counts[meal]}
              onChange={(value) =>
                setCounts((current) => ({ ...current, [meal]: value }))
              }
              decreaseLabel={`${t(`resident.mealPlan.${meal}`)} −`}
              increaseLabel={`${t(`resident.mealPlan.${meal}`)} +`}
            />
          </div>
        ))}
        <Button
          type="button"
          disabled={unchanged || isPending}
          onClick={handleSave}
        >
          {isPending && <Spinner />}
          {t("resident.mealPlan.saveDefaults")}
        </Button>
      </CardContent>
    </Card>
  );
}
