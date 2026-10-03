"use client";

import { InboxIcon } from "lucide-react";
import Link from "next/link";
import DataTable, { type Column } from "@/components/ui/data-table";
import StatusBadge from "@/components/ui/status-badge";
import TablePagination from "@/components/ui/table-pagination";
import UserAvatar from "@/components/ui/user-avatar";
import { useSuspenseManagerRequests } from "@/hooks";
import { useLocale, useLocalePath, useT } from "@/i18n/i18n-provider";
import type { ManagerRequest, ManagerRequestParams } from "@/types";
import { formatDate } from "@/utils";
import ManagerRequestReviewSheet from "./manager-request-review-sheet";

interface Props extends ManagerRequestParams {
  /** The unfiltered pending tab, whose empty state reads differently. */
  isQueue: boolean;
  handlePageChange: (page: number) => void;
}

export default function ManagerRequestTable({
  isQueue,
  handlePageChange,
  ...params
}: Props) {
  const t = useT();
  const locale = useLocale();
  const href = useLocalePath();

  const { data } = useSuspenseManagerRequests(params);

  const requests = data?.data ?? [];

  const columns: Column<ManagerRequest>[] = [
    {
      key: "applicant",
      header: t("admin.managerRequests.applicant"),
      cell: (request) => (
        <Link
          href={href(`/admin/users/${request.user.id}`)}
          className="flex min-w-0 items-center gap-2.5 text-foreground"
        >
          <UserAvatar name={request.user.name} src={request.user.avatarUrl} />
          <span className="grid min-w-0 leading-tight">
            <span className="truncate font-medium">{request.user.name}</span>
            <span className="truncate text-xs text-muted-foreground">
              {request.user.email}
            </span>
          </span>
        </Link>
      ),
    },
    {
      key: "phone",
      header: t("admin.managerRequests.phone"),
      className: "text-muted-foreground tabular-nums",
      cell: (request) => request.user.phone ?? "-",
    },
    {
      key: "mess",
      header: t("admin.managerRequests.mess"),
      cell: (request) => (
        <span className="grid max-w-64 min-w-0 leading-tight">
          <span className="truncate font-medium">{request.messName}</span>
          <span className="truncate text-xs text-muted-foreground">
            {request.messAddress}
          </span>
        </span>
      ),
    },
    {
      key: "applied",
      header: t("admin.managerRequests.applied"),
      className: "text-muted-foreground",
      cell: (request) => formatDate(request.createdAt, locale),
    },
    {
      key: "status",
      header: t("admin.managerRequests.status"),
      cell: (request) => <StatusBadge status={request.status} />,
    },
    {
      key: "actions",
      header: (
        <span className="sr-only">{t("admin.managerRequests.actions")}</span>
      ),
      className: "w-24 text-right",
      cell: (request) => <ManagerRequestReviewSheet request={request} />,
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        rows={requests}
        rowKey={(request) => request.id}
        caption={t("admin.managerRequests.caption")}
        empty={{
          icon: InboxIcon,
          title: t(
            isQueue
              ? "admin.managerRequests.emptyPending"
              : "admin.managerRequests.empty",
          ),
          description: t(
            isQueue
              ? "admin.managerRequests.emptyPendingHint"
              : "admin.managerRequests.emptyHint",
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
