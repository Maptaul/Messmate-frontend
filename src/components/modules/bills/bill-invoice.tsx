"use client";

import Logo from "@/assets/svg/Logo";
import StatusBadge from "@/components/ui/status-badge";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";
import type { BillMoney } from "@/types";
import {
  formatBDT,
  formatDate,
  formatNumber,
  todayInDhaka,
  toNumber,
} from "@/utils";

/**
 * One member's bill, itemised like the emailed invoice. The list API has no
 * opening balance or advance, so whatever the total holds beyond meals, shared
 * bills and rent is shown as one carried-over line.
 */
export default function BillInvoice({
  bill,
  messName,
  memberName,
  period,
}: {
  bill: BillMoney;
  messName: string;
  memberName: string;
  period: string;
}) {
  const t = useT();
  const locale = useLocale();

  const mealCost = toNumber(bill.mealCost);
  const sharedCost = toNumber(bill.sharedCost);
  const rentShare = toNumber(bill.rentShare);
  const totalPayable = toNumber(bill.totalPayable);
  const credit = toNumber(bill.creditAmount);
  const paid = toNumber(bill.paidAmount);
  const due = toNumber(bill.dueAmount);
  const other = totalPayable - mealCost - sharedCost - rentShare;

  const lines = [
    {
      label: t("invoice.meals", {
        count: formatNumber(bill.mealCount, locale),
      }),
      amount: formatBDT(mealCost, locale),
    },
    { label: t("invoice.shared"), amount: formatBDT(sharedCost, locale) },
    { label: t("invoice.rent"), amount: formatBDT(rentShare, locale) },
    ...(Math.abs(other) >= 0.01
      ? [{ label: t("invoice.other"), amount: formatBDT(other, locale) }]
      : []),
    {
      label: t("invoice.total"),
      amount: formatBDT(totalPayable, locale),
      strong: true,
    },
    ...(credit > 0
      ? [
          {
            label: t("invoice.credit"),
            amount: `− ${formatBDT(credit, locale)}`,
          },
        ]
      : []),
    ...(paid > 0
      ? [{ label: t("invoice.paid"), amount: `− ${formatBDT(paid, locale)}` }]
      : []),
  ];

  return (
    <div data-print-area className="space-y-6 text-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 font-semibold">
          <Logo />
          <span className="text-lg">MessMate</span>
        </div>
        <div className="text-right">
          <p className="text-base font-semibold">{t("invoice.title")}</p>
          <p className="text-muted-foreground">
            {t("invoice.issued", { date: formatDate(todayInDhaka(), locale) })}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3">
        <div>
          <dt className="text-muted-foreground">{t("invoice.mess")}</dt>
          <dd className="font-medium">{messName}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t("invoice.member")}</dt>
          <dd className="font-medium">{memberName}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t("invoice.period")}</dt>
          <dd className="font-medium">{period}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t("invoice.status")}</dt>
          <dd>
            <StatusBadge status={bill.status} />
          </dd>
        </div>
      </dl>

      <table className="w-full">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th className="py-2 font-normal">{t("invoice.item")}</th>
            <th className="py-2 text-right font-normal">
              {t("invoice.amount")}
            </th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <tr
              key={line.label}
              className={cn("border-b", line.strong && "font-semibold")}
            >
              <td className="py-2">{line.label}</td>
              <td className="py-2 text-right tabular-nums">{line.amount}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="text-base font-semibold">
            <td className="pt-3">
              {due > 0
                ? t("invoice.due")
                : due < 0
                  ? t("invoice.inCredit")
                  : bill.status === "CARRIED"
                    ? t("invoice.carried")
                    : t("invoice.settled")}
            </td>
            <td className="pt-3 text-right tabular-nums">
              {formatBDT(Math.abs(due), locale)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
