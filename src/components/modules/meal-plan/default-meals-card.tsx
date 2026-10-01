"use client";

import { SlidersHorizontalIcon } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useSetDefaultMeals } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { MealCounts as Counts } from "@/types";
import { formatNumber, getErrorMessage } from "@/utils";
import MealCounts from "./meal-counts";

/** What an unplanned day counts as, with a dialog to change it. */
export default function DefaultMealsCard({
  messId,
  defaults,
}: {
  messId: string;
  defaults: Counts;
}) {
  const t = useT();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
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
          setOpen(false);
        },
        onError: (err) => {
          toast.error(t.dynamic(getErrorMessage(err)));
        },
      },
    );
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-1">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-tint text-primary">
        <SlidersHorizontalIcon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{t("resident.mealPlan.defaultsTitle")}</p>
        <p className="text-[13px] text-muted-foreground">
          {t("resident.mealPlan.defaultsText", {
            lunch: formatNumber(defaults.lunch, locale),
            dinner: formatNumber(defaults.dinner, locale),
          })}
        </p>
      </div>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (next) setCounts(defaults);
        }}
      >
        <DialogTrigger render={<Button variant="outline" size="sm" />}>
          {t("resident.mealPlan.edit")}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("resident.mealPlan.defaultsTitle")}</DialogTitle>
            <DialogDescription>
              {t("resident.mealPlan.defaultsHint")}
            </DialogDescription>
          </DialogHeader>
          <MealCounts value={counts} onChange={setCounts} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t("resident.mealPlan.cancel")}
            </Button>
            <Button disabled={unchanged || isPending} onClick={handleSave}>
              {isPending && <Spinner />}
              {t("resident.mealPlan.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
