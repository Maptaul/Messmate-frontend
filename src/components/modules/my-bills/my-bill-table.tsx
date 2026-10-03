"use client";

import { BanknoteIcon } from "lucide-react";
import BillInvoiceDialog from "@/components/modules/bills/bill-invoice-dialog";
import EmptyState from "@/components/ui/empty-state";
import StatusBadge from "@/components/ui/status-badge";
import TablePagination from "@/components/ui/table-pagination";
import { useGetMe, useSuspenseMyBills } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";
import type { BillListParams, MyBill } from "@/types";
import { formatBDT, formatMonth, formatNumber, toNumber } from "@/utils";
import MyBillActions from "./my-bill-actions";

interface Props extends BillListParams {
  handlePageChange: (page: number) => void;
}

export default function MyBillTable({ handlePageChange, ...params }: Props) {
  const t = useT();
  const { data } = useSuspenseMyBills(params);
  const bills = data?.data ?? [];

  if (bills.length === 0) {
    return (
      <EmptyState
        icon={BanknoteIcon}
        title={
          params.status
            ? t("resident.bills.noMatch")
            : t("resident.bills.empty")
        }
        description={params.status ? undefined : t("resident.bills.emptyHint")}
      />
    );
  }

  return (
    <>
      <ul className="grid items-start gap-4 lg:grid-cols-2">
        {bills.map((bill) => (
          <BillCard key={bill.id} bill={bill} />
        ))}
      </ul>
      <TablePagination
        page={params.page ?? 1}
        totalPages={data?.meta?.totalPages ?? 0}
        total={data?.meta?.total}
        limit={data?.meta?.limit}
        handlePageChange={handlePageChange}
      />
    </>
  );
}

function BillCard({ bill }: { bill: MyBill }) {
  const t = useT();
  const locale = useLocale();
  const { data: me } = useGetMe();
  const money = (value: number) => formatBDT(value, locale);

  const due = toNumber(bill.dueAmount);
  const mealCost = toNumber(bill.mealCost);
  const shared = toNumber(bill.sharedCost);
  const rent = toNumber(bill.rentShare);
  const total = toNumber(bill.totalPayable);
  const credit = toNumber(bill.creditAmount);
  const paid = toNumber(bill.paidAmount);
  const other = total - mealCost - shared - rent;
  const rate = bill.mealCount > 0 ? mealCost / bill.mealCount : 0;
  const period = formatMonth(bill.cycle.year, bill.cycle.month, locale);
  const fileName = `messmate-bill-${bill.cycle.year}-${String(bill.cycle.month).padStart(2, "0")}`;

  const lines: [string, string, string?][] = [
    [
      t("resident.bills.mealsLine", {
        count: formatNumber(bill.mealCount, locale),
        rate: money(rate),
      }),
      money(mealCost),
    ],
    [t("resident.bills.sharedLine"), money(shared)],
    [t("resident.bills.rentLine"), money(rent)],
    ...(Math.abs(other) >= 0.01
      ? [[t("resident.bills.otherLine"), money(other)] as [string, string]]
      : []),
    [t("resident.bills.totalLine"), money(total), "total"],
    [t("resident.bills.creditLine"), `−${money(credit)}`, "credit"],
    [t("resident.bills.paidLine"), `−${money(paid)}`, "credit"],
  ];

  return (
    <li
      className={cn(
        "flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-1",
        due > 0 && "border-(--tone-a-bd)",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="font-semibold">{period}</h2>
          <p className="text-xs text-muted-foreground">
            {bill.cycle.mess.name} ·{" "}
            <span className="font-mono">#{bill.id.slice(0, 8)}</span>
          </p>
        </div>
        {due < 0 ? (
          <StatusBadge
            status="CREDIT"
            label={t("resident.bills.inCredit", { amount: money(-due) })}
          />
        ) : (
          <StatusBadge
            status={
              due === 0 && bill.status !== "CARRIED" ? "SETTLED" : bill.status
            }
          />
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span className="text-muted-foreground">
          {due > 0 ? t("resident.bills.due") : t("resident.bills.balance")}
        </span>
        <span
          className={cn(
            "text-[28px] font-bold tabular-nums",
            due <= 0 && "text-(--tone-g-fg)",
          )}
        >
          {due > 0
            ? money(due)
            : due < 0
              ? t("resident.bills.inCredit", { amount: money(-due) })
              : bill.status === "CARRIED"
                ? t("resident.bills.carried")
                : t("resident.bills.settled")}
        </span>
      </div>

      <dl className="overflow-hidden rounded-xl border text-[13px]">
        {lines.map(([label, value, kind]) => (
          <div
            key={label}
            className={cn(
              "flex justify-between gap-3 border-b px-3.5 py-2 last:border-0",
              kind === "total" && "bg-muted font-semibold",
            )}
          >
            <dt>{label}</dt>
            <dd
              className={cn(
                "tabular-nums",
                kind === "credit" && "text-(--tone-g-fg)",
              )}
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>

      {due > 0 && <MyBillActions billId={bill.id} due={due} />}

      <div className="grid grid-cols-2 gap-2">
        <BillInvoiceDialog
          bill={bill}
          messName={bill.cycle.mess.name}
          memberName={me?.data.name ?? ""}
          period={period}
          fileName={fileName}
          label={t("resident.bills.download")}
          className="h-9 w-full"
        />
        <BillInvoiceDialog
          variant="breakdown"
          bill={bill}
          messName={bill.cycle.mess.name}
          memberName={me?.data.name ?? ""}
          period={period}
          fileName={fileName}
          label={t("resident.bills.breakdown")}
          className="h-9 w-full"
        />
      </div>
    </li>
  );
}
