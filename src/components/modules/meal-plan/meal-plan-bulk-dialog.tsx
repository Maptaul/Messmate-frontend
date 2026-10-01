"use client";

import { CalendarRangeIcon, PlaneIcon } from "lucide-react";
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
import type { MealCounts as Counts, MyCalendarDay } from "@/types";
import { formatDate, formatNumber, getErrorMessage } from "@/utils";
import MealCounts from "./meal-counts";

const OFF: Counts = { lunch: 0, dinner: 0 };

/**
 * A run of open days at once. "Away" sets them all to nothing; "several days"
 * sets them all to the chosen counts.
 */
export default function MealPlanBulkDialog({
  cycleId,
  days,
  defaults,
  away = false,
}: {
  cycleId: string;
  /** The month's days; only the open ones can be picked. */
  days: MyCalendarDay[];
  defaults: Counts;
  away?: boolean;
}) {
  const t = useT();
  const locale = useLocale();
  const open = days.filter((day) => !day.isLocked);
  const [isOpen, setIsOpen] = useState(false);
  const [from, setFrom] = useState(open[0]?.date ?? "");
  const [to, setTo] = useState(open[0]?.date ?? "");
  const [counts, setCounts] = useState<Counts>(defaults);

  const { mutate: savePlan, isPending } = useSetMealPlan();

  const picked = open.filter((day) => day.date >= from && day.date <= to);
  const bad = !from || !to || to < from;
  const n = formatNumber(picked.length, locale);
  const items = open.map((day) => ({
    value: day.date,
    label: formatDate(day.date, locale),
  }));

  const handleSave = () => {
    const values = away ? OFF : counts;
    savePlan(
      {
        cycleId,
        days: picked.map((day) => ({ date: day.date, ...values })),
      },
      {
        onSuccess: () => {
          toast.success(t("resident.mealPlan.savedDays", { count: n }));
          setIsOpen(false);
        },
        onError: (err) => toast.error(t.dynamic(getErrorMessage(err))),
      },
    );
  };

  const picker = (
    label: string,
    value: string,
    onChange: (value: string) => void,
  ) => (
    <div className="flex flex-col gap-1.5">
      <span className="font-medium">{label}</span>
      <Select
        items={items}
        value={value}
        onValueChange={(next) => onChange(String(next))}
      >
        <SelectTrigger aria-label={label} className="w-full">
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
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={<Button variant={away ? "outline" : "default"} />}
        disabled={open.length === 0}
      >
        {away ? <PlaneIcon /> : <CalendarRangeIcon />}
        {away ? t("resident.mealPlan.away") : t("resident.mealPlan.bulk")}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {away ? t("resident.mealPlan.away") : t("resident.mealPlan.bulk")}
          </DialogTitle>
          <DialogDescription>
            {t("resident.mealPlan.bulkSub")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          {picker(t("resident.mealPlan.from"), from, setFrom)}
          {picker(t("resident.mealPlan.to"), to, setTo)}
        </div>
        {bad && from && to && (
          <p role="alert" className="text-[13px] text-destructive">
            {t("resident.mealPlan.rangeBad")}
          </p>
        )}
        {away ? (
          <p className="tone-b flex gap-2 rounded-xl border px-3 py-2.5">
            <PlaneIcon className="mt-0.5 size-4 shrink-0" />
            {t("resident.mealPlan.awayNote")}
          </p>
        ) : (
          <MealCounts value={counts} onChange={setCounts} />
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            {t("resident.mealPlan.cancel")}
          </Button>
          <Button disabled={bad || isPending} onClick={handleSave}>
            {isPending && <Spinner />}
            {away
              ? t("resident.mealPlan.applyAway", { count: n })
              : t("resident.mealPlan.applyBulk", { count: n })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
