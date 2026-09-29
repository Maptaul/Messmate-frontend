"use client";

import { UsersIcon } from "lucide-react";
import DataTable, { type Column } from "@/components/ui/data-table";
import StatusBadge from "@/components/ui/status-badge";
import TablePagination from "@/components/ui/table-pagination";
import UserAvatar from "@/components/ui/user-avatar";
import { useGetMe, useSuspenseUsers } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { User, UserListParams } from "@/types";
import { formatDate } from "@/utils";
import UserActions from "./user-actions";

interface Props extends UserListParams {
  handlePageChange: (page: number) => void;
}

export default function UserTable({ handlePageChange, ...params }: Props) {
  const t = useT();
  const locale = useLocale();

  const { data } = useSuspenseUsers(params);
  const { data: me } = useGetMe();

  const users = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;

  const columns: Column<User>[] = [
    {
      key: "user",
      header: t("admin.users.user"),
      cell: (user) => (
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar name={user.name} src={user.avatarUrl} />
          <div className="min-w-0">
            <p className="truncate font-medium">
              {user.name}
              {user.id === me?.data.id && (
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  ({t("admin.users.you")})
                </span>
              )}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: t("admin.users.role"),
      className: "hidden sm:table-cell",
      cell: (user) => <StatusBadge status={user.role} />,
    },
    {
      key: "status",
      header: t("admin.users.status"),
      cell: (user) => <StatusBadge status={user.status} />,
    },
    {
      key: "joined",
      header: t("admin.users.joined"),
      className: "hidden md:table-cell",
      cell: (user) => formatDate(user.createdAt, locale),
    },
    {
      key: "actions",
      header: <span className="sr-only">{t("admin.users.actions")}</span>,
      className: "text-right",
      cell: (user) =>
        user.id === me?.data.id ? null : <UserActions user={user} />,
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        rows={users}
        rowKey={(user) => user.id}
        caption={t("admin.users.caption")}
        empty={{
          icon: UsersIcon,
          title: t("admin.users.empty"),
          description: t("admin.users.emptyHint"),
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
