"use client";

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
import MealStepper from "@/components/ui/meal-stepper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useSetMealPlan } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { ActiveCycle } from "@/lib/activeCycle";
import type { MessMember } from "@/types";
import {
  dayInDhaka,
  formatLongDate,
  getErrorMessage,
  minutesToPlanCutoff,
} from "@/utils";

/**
 * The days of this month a plan can still change: tomorrow until 11 PM
 * tonight, the day after once it has passed.
 */
function openDays(cycle: ActiveCycle) {
  const prefix = `${cycle.year}-${String(cycle.month).padStart(2, "0")}-`;
  const first = minutesToPlanCutoff() > 0 ? 1 : 2;
  const days: string[] = [];
  for (let offset = first; offset < first + 31; offset++) {
    const day = dayInDhaka(offset);
    if (day.startsWith(prefix)) days.push(day);
  }
  return days;
}

export default function MemberPlanDialog({
  member,
  cycle,
  open,
  onOpenChange,
}: {
  member: MessMember;
  cycle: ActiveCycle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useT();
  const locale = useLocale();
  const days = openDays(cycle);
  const [date, setDate] = useState(days[0] ?? "");
  const [lunch, setLunch] = useState(member.defaultLunch);
  const [dinner, setDinner] = useState(member.defaultDinner);

  const { mutate: savePlan, isPending } = useSetMealPlan();

  const label = (day: string) =>
    formatLongDate(`${day}T00:00:00+06:00`, locale);
  const items = days.map((day) => ({ value: day, label: label(day) }));

  const handleSave = () => {
    savePlan(
      {
        cycleId: cycle.id,
        memberId: member.id,
        days: [{ date, lunch, dinner }],
      },
      {
        onSuccess: () => {
          toast.success(t("manager.members.planSaved", { date: label(date) }));
          onOpenChange(false);
        },
        onError: (err) => {
          toast.error(t.dynamic(getErrorMessage(err)));
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) {
          setDate(days[0] ?? "");
          setLunch(member.defaultLunch);
          setDinner(member.defaultDinner);
        }
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-115">
        <DialogHeader>
          <DialogTitle>
            {t("manager.members.planTitle", { name: member.user.name })}
          </DialogTitle>
          <DialogDescription>{t("manager.members.planHint")}</DialogDescription>
        </DialogHeader>
        {days.length === 0 ? (
          <p className="text-muted-foreground">
            {t("manager.members.noOpenDays")}
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-1.5">
              <span className="font-medium">{t("manager.members.day")}</span>
              <Select
                items={items}
                value={date}
                onValueChange={(value) => setDate(String(value))}
              >
                <SelectTrigger
                  aria-label={t("manager.members.day")}
                  className="w-full"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="font-medium">
                  {t("manager.members.lunch")}
                </span>
                <MealStepper
                  size="lg"
                  value={lunch}
                  onChange={setLunch}
                  decreaseLabel={t("manager.members.lessLunch")}
                  increaseLabel={t("manager.members.moreLunch")}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="font-medium">
                  {t("manager.members.dinner")}
                </span>
                <MealStepper
                  size="lg"
                  value={dinner}
                  onChange={setDinner}
                  decreaseLabel={t("manager.members.lessDinner")}
                  increaseLabel={t("manager.members.moreDinner")}
                />
              </div>
            </div>
          </>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending || days.length === 0}
          >
            {isPending && <Spinner />}
            {t("manager.members.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
