"use client";

import { ContactIcon } from "lucide-react";
import DataTable, { type Column } from "@/components/ui/data-table";
import StatusBadge from "@/components/ui/status-badge";
import TablePagination from "@/components/ui/table-pagination";
import UserAvatar from "@/components/ui/user-avatar";
import { useGetMe, useSuspenseMessMembers } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { ActiveCycle } from "@/lib/activeCycle";
import type { MemberListParams, MessMember } from "@/types";
import { formatDate, formatNumber } from "@/utils";
import MemberActions from "./member-actions";

interface Props extends MemberListParams {
  messId: string;
  cycle: ActiveCycle | null;
  handlePageChange: (page: number) => void;
}

export default function MemberTable({
  messId,
  cycle,
  handlePageChange,
  ...params
}: Props) {
  const t = useT();
  const locale = useLocale();

  const { data } = useSuspenseMessMembers(messId, params);
  const { data: me } = useGetMe();

  const members = data?.data ?? [];

  const columns: Column<MessMember>[] = [
    {
      key: "member",
      header: t("manager.members.member"),
      cell: (member) => (
        <div className="flex min-w-0 items-center gap-2.5">
          <UserAvatar name={member.user.name} src={member.user.avatarUrl} />
          <span className="grid min-w-0 leading-tight">
            <span className="truncate font-medium">
              {member.user.name}
              {member.user.id === me?.data.id && (
                <span className="font-normal text-muted-foreground">
                  {" · "}
                  {t("manager.members.youManager")}
                </span>
              )}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {member.user.email}
            </span>
          </span>
        </div>
      ),
    },
    {
      key: "phone",
      header: t("manager.members.phone"),
      className: "text-muted-foreground tabular-nums",
      cell: (member) => member.user.phone ?? "—",
    },
    {
      key: "status",
      header: t("manager.members.status"),
      cell: (member) => <StatusBadge status={member.status} />,
    },
    {
      key: "joined",
      header: t("manager.members.joined"),
      className: "text-muted-foreground",
      cell: (member) => formatDate(member.joinedAt, locale),
    },
    {
      key: "left",
      header: t("manager.members.left"),
      className: "text-muted-foreground",
      cell: (member) =>
        member.leftAt ? formatDate(member.leftAt, locale) : "—",
    },
    {
      key: "defaults",
      header: t("manager.members.defaults"),
      className: "tabular-nums",
      cell: (member) =>
        member.status === "ACTIVE"
          ? t("manager.members.defaultsShort", {
              lunch: formatNumber(member.defaultLunch, locale),
              dinner: formatNumber(member.defaultDinner, locale),
            })
          : "—",
    },
    {
      key: "actions",
      header: <span className="sr-only">{t("manager.members.actions")}</span>,
      className: "text-right",
      cell: (member) =>
        member.status === "ACTIVE" ? (
          <MemberActions
            member={member}
            messId={messId}
            cycle={cycle}
            isSelf={member.user.id === me?.data.id}
          />
        ) : null,
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        rows={members}
        rowKey={(member) => member.id}
        caption={t("manager.members.caption")}
        empty={{
          icon: ContactIcon,
          title: t("manager.members.empty"),
          description: t("manager.members.emptyHint"),
        }}
      />
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
