"use client";

import { CircleCheckIcon, MinusIcon, UserSearchIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DataTable, { type Column } from "@/components/ui/data-table";
import StatusBadge from "@/components/ui/status-badge";
import TablePagination from "@/components/ui/table-pagination";
import UserAvatar from "@/components/ui/user-avatar";
import { useGetMe, useSuspenseUsers } from "@/hooks";
import { useLocale, useLocalePath, useT } from "@/i18n/i18n-provider";
import type { User, UserListParams } from "@/types";
import { formatDate } from "@/utils";
import UserActions from "./user-actions";

interface Props extends UserListParams {
  handlePageChange: (page: number) => void;
  onClearFilters?: () => void;
}

export default function UserTable({
  handlePageChange,
  onClearFilters,
  ...params
}: Props) {
  const t = useT();
  const locale = useLocale();
  const href = useLocalePath();

  const { data } = useSuspenseUsers(params);
  const { data: me } = useGetMe();

  const users = data?.data ?? [];

  const columns: Column<User>[] = [
    {
      key: "user",
      header: t("admin.users.user"),
      cell: (user) => (
        <Link
          href={href(`/admin/users/${user.id}`)}
          className="flex min-w-0 items-center gap-2.5 text-foreground"
        >
          <UserAvatar name={user.name} src={user.avatarUrl} />
          <span className="grid min-w-0 leading-tight">
            <span className="truncate font-medium">{user.name}</span>
            <span className="truncate text-xs text-muted-foreground">
              {user.email}
            </span>
          </span>
        </Link>
      ),
    },
    {
      key: "phone",
      header: t("admin.users.phone"),
      className: "text-muted-foreground tabular-nums",
      cell: (user) => user.phone ?? "—",
    },
    {
      key: "role",
      header: t("admin.users.role"),
      cell: (user) => <StatusBadge status={user.role} />,
    },
    {
      key: "status",
      header: t("admin.users.status"),
      cell: (user) => <StatusBadge status={user.status} />,
    },
    {
      key: "verified",
      header: t("admin.users.verified"),
      cell: (user) =>
        user.emailVerified ? (
          <CircleCheckIcon
            className="size-4 text-(--tone-g-fg)"
            aria-label={t("admin.users.verified")}
          />
        ) : (
          <MinusIcon
            className="size-4 text-muted-foreground"
            aria-label={t("admin.users.notVerified")}
          />
        ),
    },
    {
      key: "signIn",
      header: t("admin.users.signIn"),
      className: "text-muted-foreground",
      cell: (user) =>
        user.authProvider === "GOOGLE"
          ? t("admin.users.providerGoogle")
          : t("admin.users.providerEmail"),
    },
    {
      key: "joined",
      header: t("admin.users.joined"),
      className: "text-muted-foreground",
      cell: (user) => formatDate(user.createdAt, locale),
    },
    {
      key: "actions",
      header: <span className="sr-only">{t("admin.users.actions")}</span>,
      className: "w-12 text-right",
      cell: (user) =>
        user.id === me?.data.id ? (
          <span className="text-xs text-muted-foreground">
            {t("admin.users.you")}
          </span>
        ) : (
          <UserActions user={user} />
        ),
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
          icon: UserSearchIcon,
          title: t("admin.users.empty"),
          description: t("admin.users.emptyHint"),
          action: onClearFilters && (
            <Button variant="outline" onClick={onClearFilters}>
              {t("common.clearFilters")}
            </Button>
          ),
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
