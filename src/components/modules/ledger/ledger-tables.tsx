"use client";

import { CalendarRangeIcon, ContactIcon, UtensilsIcon } from "lucide-react";
import DataTable from "@/components/ui/data-table";
import StatusBadge from "@/components/ui/status-badge";
import TablePagination from "@/components/ui/table-pagination";
import {
  useSuspenseCycleMeals,
  useSuspenseMealSummary,
  useSuspenseMess,
  useSuspenseMessMembers,
} from "@/hooks";
import useQueryParams from "@/hooks/query-params.hook";
import { useLocale, useT } from "@/i18n/i18n-provider";
import {
  ALL_MEMBERS_PARAMS,
  formatBDT,
  formatDate,
  formatMonth,
  formatNumber,
  ledgerMealsParams,
} from "@/utils";

/** Every meal entry of the month, newest first. */
export function LedgerMeals({ cycleId }: { cycleId: string }) {
  const t = useT();
  const locale = useLocale();
  const { get, set } = useQueryParams();
  const params = ledgerMealsParams(get);

  const { data } = useSuspenseCycleMeals(cycleId, params);

  return (
    <>
      <DataTable
        rows={data.data}
        rowKey={(entry) => entry.id}
        caption={t("resident.ledger.tabs.meals")}
        empty={{ icon: UtensilsIcon, title: t("resident.ledger.mealsEmpty") }}
        columns={[
          {
            key: "date",
            header: t("resident.ledger.date"),
            className: "font-medium whitespace-nowrap",
            cell: (entry) => formatDate(entry.date, locale),
          },
          {
            key: "member",
            header: t("resident.ledger.member"),
            cell: (entry) => entry.member.user.name,
          },
          {
            key: "lunch",
            header: t("resident.ledger.lunch"),
            className: "text-right tabular-nums",
            cell: (entry) => formatNumber(entry.lunch, locale),
          },
          {
            key: "dinner",
            header: t("resident.ledger.dinner"),
            className: "text-right tabular-nums",
            cell: (entry) => formatNumber(entry.dinner, locale),
          },
        ]}
      />
      <TablePagination
        page={params.page ?? 1}
        totalPages={data.meta?.totalPages ?? 0}
        total={data.meta?.total}
        limit={data.meta?.limit}
        handlePageChange={(page) => set({ page })}
      />
    </>
  );
}

/** Who is in the mess, and since when. */
export function LedgerMembers({ messId }: { messId: string }) {
  const t = useT();
  const locale = useLocale();

  const { data } = useSuspenseMessMembers(messId, ALL_MEMBERS_PARAMS);
  const { data: mess } = useSuspenseMess(messId);
  const managerId = mess.data.manager.id;

  return (
    <DataTable
      rows={data.data}
      rowKey={(member) => member.id}
      caption={t("resident.ledger.tabs.members")}
      empty={{ icon: ContactIcon, title: t("resident.ledger.membersEmpty") }}
      columns={[
        {
          key: "member",
          header: t("resident.ledger.member"),
          className: "font-medium",
          cell: (member) =>
            member.user.id === managerId
              ? `${member.user.name} · ${t("resident.ledger.factManager")}`
              : member.user.name,
        },
        {
          key: "status",
          header: t("resident.ledger.status"),
          cell: (member) => <StatusBadge status={member.status} />,
        },
        {
          key: "joined",
          header: t("resident.ledger.joined"),
          className: "whitespace-nowrap text-muted-foreground",
          cell: (member) => formatDate(member.joinedAt, locale),
        },
      ]}
    />
  );
}

/** Every month of the mess, with its final (or running) figures. */
export function LedgerCycles({ messId }: { messId: string }) {
  const t = useT();
  const locale = useLocale();
  const { data } = useSuspenseMess(messId);

  return (
    <DataTable
      rows={data.data.cycles}
      rowKey={(cycle) => cycle.id}
      caption={t("resident.ledger.tabs.cycles")}
      empty={{
        icon: CalendarRangeIcon,
        title: t("resident.ledger.cyclesEmpty"),
      }}
      columns={[
        {
          key: "month",
          header: t("resident.ledger.month"),
          className: "font-medium",
          cell: (cycle) => formatMonth(cycle.year, cycle.month, locale),
        },
        {
          key: "status",
          header: t("resident.ledger.status"),
          cell: (cycle) => <StatusBadge status={cycle.status} />,
        },
        {
          key: "meals",
          header: t("resident.ledger.meals"),
          className: "text-right tabular-nums",
          cell: (cycle) =>
            cycle.totalMeals === null
              ? "—"
              : formatNumber(cycle.totalMeals, locale),
        },
        {
          key: "rate",
          header: t("resident.ledger.rate"),
          className: "text-right tabular-nums",
          cell: (cycle) =>
            cycle.mealRate === null ? "—" : formatBDT(cycle.mealRate, locale),
        },
      ]}
    />
  );
}

/** Each member's lunches, dinners and total for the month. */
export function LedgerSummary({ cycleId }: { cycleId: string }) {
  const t = useT();
  const locale = useLocale();
  const n = (value: number) => formatNumber(value, locale);
  const { data } = useSuspenseMealSummary(cycleId);
  const rows = data.data.members;

  return (
    <DataTable
      rows={rows}
      rowKey={(row) => row.memberId}
      caption={t("resident.ledger.tabs.summary")}
      empty={{ icon: UtensilsIcon, title: t("resident.ledger.mealsEmpty") }}
      columns={[
        {
          key: "member",
          header: t("resident.ledger.member"),
          className: "font-medium",
          cell: (row) => row.name,
        },
        {
          key: "lunch",
          header: t("resident.ledger.lunch"),
          className: "text-right tabular-nums",
          cell: (row) => n(row.lunch),
        },
        {
          key: "dinner",
          header: t("resident.ledger.dinner"),
          className: "text-right tabular-nums",
          cell: (row) => n(row.dinner),
        },
        {
          key: "total",
          header: t("resident.ledger.total"),
          className: "text-right font-semibold tabular-nums",
          cell: (row) => n(row.totalMeals),
        },
      ]}
      footer={
        <tr>
          <td className="px-3 py-2.5 pl-4">{t("resident.ledger.total")}</td>
          <td className="px-3 py-2.5 text-right tabular-nums">
            {n(rows.reduce((sum, row) => sum + row.lunch, 0))}
          </td>
          <td className="px-3 py-2.5 text-right tabular-nums">
            {n(rows.reduce((sum, row) => sum + row.dinner, 0))}
          </td>
          <td className="px-3 py-2.5 pr-4 text-right tabular-nums">
            {n(data.data.totalMeals)}
          </td>
        </tr>
      }
    />
  );
}
