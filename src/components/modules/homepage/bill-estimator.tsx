"use client";

import { RotateCcwIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { formatBDT } from "@/utils";

const START = {
  bazar: "19450",
  meals: "312.5",
  mine: "58.5",
  shared: "7400",
  members: "6",
};
type Key = keyof typeof START;

/**
 * The meal-rate formula as a calculator: rate = bazar ÷ meals, your share =
 * your meals × rate + shared bills ÷ members.
 */
export default function BillEstimator() {
  const t = useT();
  const locale = useLocale();
  const [values, setValues] = useState(START);

  const num = (key: Key) => Number.parseFloat(values[key]) || 0;
  const rate = num("meals") > 0 ? num("bazar") / num("meals") : 0;
  const mealCost = num("mine") * rate;
  const share = num("members") > 0 ? num("shared") / num("members") : 0;
  const money = (value: number) => formatBDT(value, locale);

  const fields: [Key, string, string, string, string][] = [
    ["bazar", t("marketing.home.calc.bazar"), "৳", "", "50"],
    [
      "meals",
      t("marketing.home.calc.meals"),
      "",
      t("marketing.home.calc.unitMeals"),
      "0.5",
    ],
    [
      "mine",
      t("marketing.home.calc.mine"),
      "",
      t("marketing.home.calc.unitMeals"),
      "0.5",
    ],
    ["shared", t("marketing.home.calc.shared"), "৳", "", "50"],
    [
      "members",
      t("marketing.home.calc.members"),
      "",
      t("marketing.home.calc.unitPeople"),
      "1",
    ],
  ];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-2">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold">{t("marketing.home.calc.title")}</h3>
        <Button variant="ghost" size="sm" onClick={() => setValues(START)}>
          <RotateCcwIcon />
          {t("marketing.home.calc.reset")}
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map(([key, label, prefix, suffix, step]) => {
          const bad = values[key] !== "" && !(num(key) > 0);
          return (
            <div key={key} className="flex flex-col gap-1.5">
              <label
                htmlFor={`calc-${key}`}
                className="text-[13px] font-medium"
              >
                {label}
              </label>
              <span className="relative">
                {prefix && (
                  <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground">
                    {prefix}
                  </span>
                )}
                <Input
                  id={`calc-${key}`}
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step={step}
                  value={values[key]}
                  aria-invalid={bad}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      [key]: event.target.value,
                    }))
                  }
                  className={`tabular-nums ${prefix ? "pl-6.5" : ""} ${suffix ? "pr-14" : ""}`}
                />
                {suffix && (
                  <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-xs text-muted-foreground">
                    {suffix}
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </div>
      <dl className="overflow-hidden rounded-xl border text-[13px]">
        {[
          [t("marketing.home.calc.rate"), rate ? money(rate) : "-"],
          [t("marketing.home.calc.mealCost"), money(mealCost)],
          [t("marketing.home.calc.share"), money(share)],
        ].map(([label, value]) => (
          <div
            key={label}
            className="flex justify-between gap-3 border-b px-3.5 py-2"
          >
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-medium tabular-nums">{value}</dd>
          </div>
        ))}
        <div className="flex items-baseline justify-between gap-3 bg-primary-tint px-3.5 py-3 text-primary">
          <dt className="font-semibold">{t("marketing.home.calc.total")}</dt>
          <dd className="text-xl font-bold tabular-nums">
            {money(mealCost + share)}
          </dd>
        </div>
      </dl>
      <p className="text-xs text-muted-foreground">
        {t("marketing.home.calc.note")}
      </p>
    </div>
  );
}
