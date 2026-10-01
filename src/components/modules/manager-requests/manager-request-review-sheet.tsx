"use client";

import { CheckIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import RejectRequestForm from "@/components/form/reject-request-form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import StatusBadge from "@/components/ui/status-badge";
import UserAvatar from "@/components/ui/user-avatar";
import { useReviewManagerRequest } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { ManagerRequest } from "@/types";
import { formatDate, formatDateTime, getErrorMessage } from "@/utils";

/** One request in full; a pending one can be approved or rejected here. */
export default function ManagerRequestReviewSheet({
  request,
}: {
  request: ManagerRequest;
}) {
  const t = useT();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const { mutate: review, isPending } = useReviewManagerRequest();

  const isPendingRequest = request.status === "PENDING";
  const { user } = request;

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setRejecting(false);
  };

  const approve = () =>
    review(
      { requestId: request.id, status: "APPROVED" },
      {
        onSuccess: () => {
          toast.success(t("admin.toast.requestApproved", { name: user.name }));
          handleOpenChange(false);
        },
        onError: (err) => toast.error(t.dynamic(getErrorMessage(err))),
      },
    );

  const rows: [string, string][] = [
    [t("admin.managerRequests.phone"), user.phone ?? "—"],
    [
      t("admin.managerRequests.account"),
      t("admin.managerRequests.joined", {
        date: formatDate(user.createdAt, locale),
      }),
    ],
    [t("admin.managerRequests.messName"), request.messName],
    [t("admin.managerRequests.messAddress"), request.messAddress],
    [
      t("admin.managerRequests.appliedOn"),
      formatDateTime(request.createdAt, locale),
    ],
    ...(request.reviewedAt
      ? [
          [
            t("admin.managerRequests.reviewedOn"),
            formatDateTime(request.reviewedAt, locale),
          ] as [string, string],
        ]
      : []),
    ...(request.rejectionReason
      ? [
          [t("admin.managerRequests.reason"), request.rejectionReason] as [
            string,
            string,
          ],
        ]
      : []),
  ];

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger
        render={
          <Button
            variant={isPendingRequest ? "outline" : "ghost"}
            size="sm"
            aria-label={t("admin.managerRequests.reviewAria", {
              name: user.name,
            })}
          />
        }
      >
        {t(
          isPendingRequest
            ? "admin.managerRequests.review"
            : "admin.managerRequests.view",
        )}
      </SheetTrigger>
      <SheetContent className="w-full gap-4 overflow-y-auto p-6 sm:max-w-115">
        <SheetHeader className="p-0">
          <SheetTitle className="text-lg">
            {t("admin.managerRequests.sheetTitle")}
          </SheetTitle>
          <SheetDescription>
            {t("admin.managerRequests.sheetDescription")}
          </SheetDescription>
        </SheetHeader>

        <div className="flex items-center gap-3">
          <UserAvatar name={user.name} src={user.avatarUrl} />
          <span className="grid min-w-0 flex-1 leading-tight">
            <span className="truncate font-semibold">{user.name}</span>
            <span className="truncate text-[13px] text-muted-foreground">
              {user.email}
            </span>
          </span>
          <StatusBadge status={request.status} />
        </div>

        <dl className="overflow-hidden rounded-xl border text-[13px]">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between gap-3 border-b px-3.5 py-2.5 last:border-0"
            >
              <dt className="shrink-0 text-muted-foreground">{label}</dt>
              <dd className="text-right break-words">{value}</dd>
            </div>
          ))}
        </dl>

        {isPendingRequest &&
          (rejecting ? (
            <RejectRequestForm
              request={request}
              handleClose={() => handleOpenChange(false)}
              handleCancel={() => setRejecting(false)}
            />
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-[13px] text-muted-foreground">
                {t("admin.managerRequests.approveNote")}
              </p>
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={approve}
                  disabled={isPending}
                >
                  {isPending ? <Spinner /> : <CheckIcon />}
                  {t(
                    isPending
                      ? "admin.managerRequests.approving"
                      : "admin.managerRequests.approve",
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-destructive"
                  onClick={() => setRejecting(true)}
                  disabled={isPending}
                >
                  <XIcon />
                  {t("admin.managerRequests.reject")}
                </Button>
              </div>
            </div>
          ))}
      </SheetContent>
    </Sheet>
  );
}
