"use client";

import { UserMinusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRemoveMember } from "@/hooks";
import { useT } from "@/i18n/i18n-provider";
import type { MessMember } from "@/types";
import { getErrorMessage } from "@/utils";

export default function MemberActions({ member }: { member: MessMember }) {
  const t = useT();
  const [confirmRemove, setConfirmRemove] = useState(false);

  const { mutate: remove, isPending } = useRemoveMember();

  const handleRemove = () => {
    remove(member.id, {
      onSuccess: (res) => {
        toast.success(t("toast.memberRemoved", { name: res.data.user.name }));
        setConfirmRemove(false);
      },
      onError: (err) => {
        toast.error(t.dynamic(getErrorMessage(err)));
      },
    });
  };

  if (confirmRemove) {
    return (
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setConfirmRemove(false)}
        >
          {t("manager.members.cancel")}
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleRemove}
          disabled={isPending}
          title={t("manager.members.removeBody")}
        >
          {t("manager.members.removeConfirm")}
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className="text-destructive hover:text-destructive"
      aria-label={`${t("manager.members.remove")}: ${member.user.name}`}
      onClick={() => setConfirmRemove(true)}
    >
      <UserMinusIcon />
    </Button>
  );
}
