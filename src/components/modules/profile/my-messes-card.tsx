"use client";

import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import JoinMessForm from "@/components/form/join-mess-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import InlineConfirm from "@/components/ui/inline-confirm";
import Panel from "@/components/ui/panel";
import StatusBadge from "@/components/ui/status-badge";
import { useLeaveMess, useSuspenseMyMemberships } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { MyMembership } from "@/types";
import { formatDate, getErrorMessage } from "@/utils";

export default function MyMessesCard({ isMember }: { isMember: boolean }) {
  const t = useT();
  const locale = useLocale();
  const router = useRouter();
  const [joinOpen, setJoinOpen] = useState(false);
  const [leaving, setLeaving] = useState<string | null>(null);

  const { data } = useSuspenseMyMemberships();
  const { mutate: leave, isPending } = useLeaveMess();

  const handleLeave = (membership: MyMembership) =>
    leave(membership.mess.id, {
      onSuccess: () => {
        toast.success(t("toast.leftMess", { mess: membership.mess.name }));
        setLeaving(null);
        // The dashboard shell picks its mess on the server.
        router.refresh();
      },
      onError: (err) => toast.error(t.dynamic(getErrorMessage(err))),
    });

  const joinAnother = isMember && (
    <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
      <DialogTrigger render={<Button variant="ghost" size="sm" />}>
        <PlusIcon />
        {t("membership.joinAnother")}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("membership.joinTitle")}</DialogTitle>
          <DialogDescription>{t("membership.joinBody")}</DialogDescription>
        </DialogHeader>
        <JoinMessForm onDone={() => setJoinOpen(false)} />
      </DialogContent>
    </Dialog>
  );

  return (
    <Panel flush title={t("profile.myMesses")} action={joinAnother}>
      {data.data.length === 0 ? (
        <p className="px-5 py-4 text-[13px] text-muted-foreground">
          {t("profile.noMesses")}
        </p>
      ) : (
        <ul className="max-h-80 overflow-y-auto">
          {data.data.map((membership) => (
            <li
              key={membership.id}
              className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-2.5 last:border-0"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{membership.mess.name}</p>
                <p className="text-xs text-muted-foreground">
                  {t("profile.joined", {
                    date: formatDate(membership.joinedAt, locale),
                  })}
                </p>
              </div>
              {leaving === membership.id ? (
                <InlineConfirm
                  hint={t("membership.leaveHint")}
                  confirmLabel={t("membership.leave")}
                  onConfirm={() => handleLeave(membership)}
                  onCancel={() => setLeaving(null)}
                  pending={isPending}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <StatusBadge status={membership.status} />
                  {isMember && membership.status === "ACTIVE" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLeaving(membership.id)}
                    >
                      {t("membership.leave")}
                    </Button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
