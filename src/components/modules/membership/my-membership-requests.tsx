"use client";

import { CheckIcon, InboxIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Panel from "@/components/ui/panel";
import {
  useAnswerMembership,
  useCancelMembership,
  useMyMembershipRequests,
} from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { MyMembershipRequest } from "@/types";
import { formatDate, getErrorMessage } from "@/utils";

/** A member's open invitations (accept or decline) and requests (withdraw). */
export default function MyMembershipRequests() {
  const t = useT();
  const locale = useLocale();
  const router = useRouter();

  const { data } = useMyMembershipRequests();
  const answer = useAnswerMembership();
  const cancel = useCancelMembership();

  const rows = data?.data ?? [];
  const busy = answer.isPending || cancel.isPending;

  if (rows.length === 0) return null;

  const respond = (request: MyMembershipRequest, accept: boolean) =>
    answer.mutate(
      { id: request.id, accept },
      {
        onSuccess: () => {
          if (accept) {
            toast.success(t("toast.joinedMess", { mess: request.mess.name }));
            // The dashboard shell picks its mess on the server.
            router.refresh();
          } else {
            toast.success(t("toast.invitationDeclined"));
          }
        },
        onError: (err) => toast.error(t.dynamic(getErrorMessage(err))),
      },
    );

  const withdraw = (request: MyMembershipRequest) =>
    cancel.mutate(request.id, {
      onSuccess: () => toast.success(t("toast.requestWithdrawn")),
      onError: (err) => toast.error(t.dynamic(getErrorMessage(err))),
    });

  return (
    <Panel
      flush
      title={t("membership.pendingTitle")}
      icon={<InboxIcon className="size-4 text-muted-foreground" />}
    >
      <ul>
        {rows.map((request) => {
          const date = formatDate(request.createdAt, locale);
          return (
            <li
              key={request.id}
              className="flex flex-wrap items-center gap-3 border-b px-5 py-3 last:border-0"
            >
              <div className="grid min-w-0 flex-1 leading-tight">
                <span className="truncate font-medium">
                  {request.mess.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {request.kind === "INVITE"
                    ? t("membership.invitedBy", {
                        manager: request.mess.manager.name,
                        date,
                      })
                    : t("membership.youAsked", { date })}
                </span>
              </div>
              {request.kind === "INVITE" ? (
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    disabled={busy}
                    onClick={() => respond(request, true)}
                  >
                    <CheckIcon />
                    {t("membership.accept")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy}
                    onClick={() => respond(request, false)}
                  >
                    <XIcon />
                    {t("membership.decline")}
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={busy}
                  onClick={() => withdraw(request)}
                >
                  {t("membership.withdraw")}
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
