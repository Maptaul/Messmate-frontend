"use client";

import {
  BanIcon,
  EllipsisIcon,
  EyeIcon,
  LockOpenIcon,
  UserCogIcon,
} from "lucide-react";
import Link from "next/link";
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
import { useUpdateUserStatus } from "@/hooks";
import { useLocalePath, useT } from "@/i18n/i18n-provider";
import type { User } from "@/types";
import { getErrorMessage } from "@/utils";
import ChangeRoleDialog from "./change-role-dialog";

/**
 * Row menu: view, change role, block. Blocking asks in the row itself
 * (Cancel · Block user); unblocking needs no second look.
 */
export default function UserActions({ user }: { user: User }) {
  const t = useT();
  const href = useLocalePath();
  const [confirmBlock, setConfirmBlock] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);

  const { mutate: updateStatus, isPending } = useUpdateUserStatus();

  const isBlocked = user.status === "BLOCKED";

  // Optimistic: the badge flips at once and flips back if the API refuses.
  const handleStatus = () => {
    updateStatus(
      { userId: user.id, status: isBlocked ? "ACTIVE" : "BLOCKED" },
      {
        onSuccess: (res) => {
          toast.success(
            t(
              res.data.status === "BLOCKED"
                ? "admin.toast.blocked"
                : "admin.toast.unblocked",
              { name: res.data.name },
            ),
          );
        },
        onError: (err) => {
          toast.error(t.dynamic(getErrorMessage(err)));
        },
      },
    );
    setConfirmBlock(false);
  };

  if (confirmBlock) {
    return (
      <InlineConfirm
        confirmLabel={t("admin.users.block")}
        onConfirm={handleStatus}
        onCancel={() => setConfirmBlock(false)}
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
              aria-label={t("admin.users.openActions", { name: user.name })}
            />
          }
        >
          <EllipsisIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-55">
          <DropdownMenuItem
            render={<Link href={href(`/admin/users/${user.id}`)} />}
          >
            <EyeIcon />
            {t("admin.users.viewDetails")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setRoleOpen(true)}>
            <UserCogIcon />
            {t("admin.users.changeRoleMenu")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => (isBlocked ? handleStatus() : setConfirmBlock(true))}
          >
            {isBlocked ? <LockOpenIcon /> : <BanIcon />}
            {t(isBlocked ? "admin.users.unblock" : "admin.users.block")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ChangeRoleDialog
        user={user}
        open={roleOpen}
        onOpenChange={setRoleOpen}
      />
    </>
  );
}
