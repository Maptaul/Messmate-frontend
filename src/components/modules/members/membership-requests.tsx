"use client";

import { CheckIcon, InboxIcon, MailIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Panel from "@/components/ui/panel";
import { Skeleton } from "@/components/ui/skeleton";
import UserAvatar from "@/components/ui/user-avatar";
import {
  useAcceptMembership,
  useCancelMembership,
  useDeclineMembership,
  useMessMembershipRequests,
} from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { MessMembershipRequest } from "@/types";
import { formatDate, getErrorMessage } from "@/utils";

const PENDING = { status: "PENDING", limit: 50 } as const;

export default function MembershipRequests({ messId }: { messId: string }) {
  const t = useT();
  const locale = useLocale();

  const { data, isPending: loading } = useMessMembershipRequests(
    messId,
    PENDING,
  );
  const accept = useAcceptMembership();
  const decline = useDeclineMembership();
  const cancel = useCancelMembership();

  const rows = data?.data ?? [];
  const busy = accept.isPending || decline.isPending || cancel.isPending;

  const handleApprove = (request: MessMembershipRequest) =>
    accept.mutate(request.id, {
      onSuccess: () =>
        toast.success(
          t("toast.requestApprovedMember", {
            name: request.user.name ?? request.user.email,
          }),
        ),
      onError: (err) => toast.error(t.dynamic(getErrorMessage(err))),
    });

  const handleReject = (request: MessMembershipRequest) =>
    decline.mutate(request.id, {
      onSuccess: () =>
        toast.success(
          t("toast.requestDeclined", {
            name: request.user.name ?? request.user.email,
          }),
        ),
      onError: (err) => toast.error(t.dynamic(getErrorMessage(err))),
    });

  const withdraw = (request: MessMembershipRequest) =>
    cancel.mutate(request.id, {
      onSuccess: () =>
        toast.success(
          t("toast.invitationWithdrawn", { email: request.user.email }),
        ),
      onError: (err) => toast.error(t.dynamic(getErrorMessage(err))),
    });

  return (
    <Panel
      flush
      title={t("manager.members.waitingTitle")}
      icon={<InboxIcon className="size-4 text-muted-foreground" />}
    >
      {loading ? (
        <Skeleton className="m-5 h-12 rounded-lg" />
      ) : rows.length === 0 ? (
        <p className="px-5 py-4 text-[13px] text-muted-foreground">
          {t("manager.members.waitingEmpty")}
        </p>
      ) : (
        <ul className="max-h-80 overflow-y-auto">
          {rows.map((request) => (
            <li
              key={request.id}
              className="flex flex-wrap items-center gap-3 border-b px-5 py-3 last:border-0"
            >
              {request.kind === "REQUEST" ? (
                <UserAvatar
                  name={request.user.name ?? request.user.email}
                  src={request.user.avatarUrl ?? null}
                />
              ) : (
                <span className="grid size-8 place-items-center rounded-full bg-muted">
                  <MailIcon className="size-4 text-muted-foreground" />
                </span>
              )}
              <div className="grid min-w-0 flex-1 leading-tight">
                <span className="truncate font-medium">
                  {request.user.name ?? request.user.email}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {t(
                    request.kind === "REQUEST"
                      ? "manager.members.askedOn"
                      : "manager.members.invitedOn",
                    { date: formatDate(request.createdAt, locale) },
                  )}
                  {request.kind === "REQUEST" && ` · ${request.user.email}`}
                </span>
                {request.note && (
                  <span className="mt-1 text-[13px] text-foreground-2">
                    “{request.note}”
                  </span>
                )}
              </div>
              {request.kind === "REQUEST" ? (
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    disabled={busy}
                    onClick={() => handleApprove(request)}
                  >
                    <CheckIcon />
                    {t("manager.members.approve")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy}
                    onClick={() => handleReject(request)}
                  >
                    <XIcon />
                    {t("manager.members.reject")}
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={busy}
                  onClick={() => withdraw(request)}
                >
                  {t("manager.members.withdraw")}
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
