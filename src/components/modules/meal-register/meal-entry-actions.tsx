"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";
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
import InlineConfirm from "@/components/ui/inline-confirm";
import MealStepper from "@/components/ui/meal-stepper";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteMeal, useUpdateMeal } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { MealCounts, MealEntry } from "@/types";
import { formatDate, getErrorMessage } from "@/utils";

export default function MealEntryActions({
  entry,
  name,
}: {
  entry: MealEntry;
  name: string;
}) {
  const t = useT();
  const locale = useLocale();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [counts, setCounts] = useState<MealCounts>({
    lunch: entry.lunch,
    dinner: entry.dinner,
  });

  const { mutate: updateMeal, isPending: updatePending } = useUpdateMeal();
  const { mutate: deleteMeal, isPending: deletePending } = useDeleteMeal();

  const handleUpdate = () => {
    updateMeal(
      { mealId: entry.id, ...counts },
      {
        onSuccess: () => {
          toast.success(t("toast.mealUpdated", { name }));
          setEditOpen(false);
        },
        onError: (err) => {
          toast.error(t.dynamic(getErrorMessage(err)));
        },
      },
    );
  };

  const handleDelete = () => {
    deleteMeal(entry.id, {
      onSuccess: () => {
        toast.success(t("toast.mealDeleted"));
        setConfirmDelete(false);
      },
      onError: (err) => {
        toast.error(t.dynamic(getErrorMessage(err)));
      },
    });
  };

  if (confirmDelete) {
    return (
      <InlineConfirm
        hint={t("manager.meals.deleteHint")}
        confirmLabel={t("manager.meals.deleteConfirm")}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
        pending={deletePending}
      />
    );
  }

  return (
    <>
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={t("manager.meals.editEntry", { name })}
          onClick={() => {
            setCounts({ lunch: entry.lunch, dinner: entry.dinner });
            setEditOpen(true);
          }}
        >
          <PencilIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:bg-destructive-tint hover:text-destructive"
          aria-label={t("manager.meals.deleteEntry", { name })}
          onClick={() => setConfirmDelete(true)}
        >
          <Trash2Icon />
        </Button>
      </div>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("manager.meals.entryTitle")}</DialogTitle>
            <DialogDescription>
              {t("manager.meals.entryBody", {
                name,
                date: formatDate(entry.date, locale),
              })}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            {(["lunch", "dinner"] as const).map((meal) => (
              <div key={meal} className="flex flex-col gap-1.5">
                <span className="font-medium">
                  {t(`manager.meals.${meal}`)}
                </span>
                <MealStepper
                  size="lg"
                  value={counts[meal]}
                  onChange={(value) =>
                    setCounts((current) => ({ ...current, [meal]: value }))
                  }
                  decreaseLabel={t("manager.meals.decrease", {
                    name,
                    meal: t(`manager.meals.${meal}`),
                  })}
                  increaseLabel={t("manager.meals.increase", {
                    name,
                    meal: t(`manager.meals.${meal}`),
                  })}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              {t("manager.meals.cancel")}
            </Button>
            <Button onClick={handleUpdate} disabled={updatePending}>
              {updatePending && <Spinner />}
              {t("manager.meals.saveEntry")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
