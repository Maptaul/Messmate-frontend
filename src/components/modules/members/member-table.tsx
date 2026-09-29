"use client";

import { ContactIcon } from "lucide-react";
import DataTable, { type Column } from "@/components/ui/data-table";
import StatusBadge from "@/components/ui/status-badge";
import TablePagination from "@/components/ui/table-pagination";
import UserAvatar from "@/components/ui/user-avatar";
import { useSuspenseMessMembers } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { MemberListParams, MessMember } from "@/types";
import { formatDate } from "@/utils";
import MemberActions from "./member-actions";

interface Props extends MemberListParams {
  messId: string;
  handlePageChange: (page: number) => void;
}

export default function MemberTable({
  messId,
  handlePageChange,
  ...params
}: Props) {
  const t = useT();
  const locale = useLocale();

  const { data } = useSuspenseMessMembers(messId, params);

  const members = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;

  const columns: Column<MessMember>[] = [
    {
      key: "member",
      header: t("manager.members.member"),
      cell: (member) => (
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar name={member.user.name} src={member.user.avatarUrl} />
          <div className="min-w-0">
            <p className="truncate font-medium">{member.user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {member.user.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: t("manager.members.phone"),
      className: "hidden md:table-cell",
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
      className: "hidden sm:table-cell",
      cell: (member) => formatDate(member.joinedAt, locale),
    },
    {
      key: "actions",
      header: <span className="sr-only">{t("manager.members.actions")}</span>,
      className: "text-right",
      cell: (member) =>
        member.status === "ACTIVE" ? <MemberActions member={member} /> : null,
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
      {totalPages > 1 && (
        <div className="my-5">
          <TablePagination
            page={params.page ?? 1}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
}
