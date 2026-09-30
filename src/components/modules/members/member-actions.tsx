"use client";

import {
  CalendarDaysIcon,
  EllipsisIcon,
  SlidersHorizontalIcon,
  UserMinusIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import InlineConfirm from "@/components/ui/inline-confirm";
import { useRemoveMember } from "@/hooks";
import { useT } from "@/i18n/i18n-provider";
import type { ActiveCycle } from "@/lib/activeCycle";
import type { MessMember } from "@/types";
import { getErrorMessage } from "@/utils";
import MemberDefaultsDialog from "./member-defaults-dialog";
import MemberPlanDialog from "./member-plan-dialog";

/**
 * Row menu: default meals, plan their meals, remove (in-row confirm). The API
 * refuses to remove anyone who still owes money; its message says so.
 */
export default function MemberActions({
  member,
  messId,
  cycle,
  isSelf,
}: {
  member: MessMember;
  messId: string;
  cycle: ActiveCycle | null;
  isSelf: boolean;
}) {
  const t = useT();
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [defaultsOpen, setDefaultsOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);

  const { mutate: remove, isPending } = useRemoveMember();

  const handleRemove = () => {
    remove(member.id, {
      onSuccess: (res) => {
        toast.success(t("toast.memberRemoved", { name: res.data.user.name }));
        setConfirmRemove(false);
      },
      onError: (err) => {
        toast.error(t.dynamic(getErrorMessage(err)));
        setConfirmRemove(false);
      },
    });
  };

  if (confirmRemove) {
    return (
      <InlineConfirm
        confirmLabel={t("manager.members.remove")}
        onConfirm={handleRemove}
        onCancel={() => setConfirmRemove(false)}
        pending={isPending}
      />
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label={`${t("manager.members.actions")}: ${member.user.name}`}
            />
          }
        >
          <EllipsisIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-55">
          <DropdownMenuItem onClick={() => setDefaultsOpen(true)}>
            <SlidersHorizontalIcon />
            {t("manager.members.setDefaults")}
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!cycle || cycle.status !== "OPEN"}
            onClick={() => setPlanOpen(true)}
          >
            <CalendarDaysIcon />
            {t("manager.members.planFor")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={isSelf}
            onClick={() => setConfirmRemove(true)}
          >
            <UserMinusIcon />
            {t("manager.members.remove")}
          </DropdownMenuItem>
          {isSelf && (
            <p className="px-2 pb-1.5 pl-8 text-xs text-muted-foreground">
              {t("manager.members.cantRemoveSelf")}
            </p>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <MemberDefaultsDialog
        member={member}
        messId={messId}
        open={defaultsOpen}
        onOpenChange={setDefaultsOpen}
      />
      {cycle && (
        <MemberPlanDialog
          member={member}
          cycle={cycle}
          open={planOpen}
          onOpenChange={setPlanOpen}
        />
      )}
    </>
  );
}
