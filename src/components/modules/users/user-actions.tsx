"use client";

import { MoreHorizontalIcon } from "lucide-react";
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
import { useUpdateUserRole, useUpdateUserStatus } from "@/hooks";
import { useT } from "@/i18n/i18n-provider";
import type { User, UserRole } from "@/types";
import { getErrorMessage } from "@/utils";

const roles: UserRole[] = ["ADMIN", "MESS_MANAGER", "MEMBER"];

export default function UserActions({ user }: { user: User }) {
  const t = useT();
  const [confirmStatus, setConfirmStatus] = useState(false);

  const { mutate: updateRole, isPending: rolePending } = useUpdateUserRole();
  const { mutate: updateStatus, isPending: statusPending } =
    useUpdateUserStatus();

  const isBlocking = user.status === "ACTIVE";

  const handleRole = (role: UserRole) => {
    updateRole(
      { userId: user.id, role },
      {
        onSuccess: (res) => {
          toast.success(
            t("admin.toast.roleChanged", {
              name: res.data.name,
              role: t(`roles.${res.data.role}`),
            }),
          );
        },
        onError: (err) => {
          toast.error(t.dynamic(getErrorMessage(err)));
        },
      },
    );
  };

  // Optimistic: the badge flips at once and flips back if the API refuses.
  const handleStatus = () => {
    updateStatus(
      { userId: user.id, status: isBlocking ? "BLOCKED" : "ACTIVE" },
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
    setConfirmStatus(false);
  };

  if (confirmStatus) {
    return (
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setConfirmStatus(false)}
        >
          {t("admin.users.cancel")}
        </Button>
        <Button
          variant={isBlocking ? "destructive" : "default"}
          size="sm"
          onClick={handleStatus}
          disabled={statusPending}
        >
          {t(isBlocking ? "admin.users.block" : "admin.users.unblock")}
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={rolePending}
            aria-label={t("admin.users.openActions", { name: user.name })}
          />
        }
      >
        <MoreHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {roles
          .filter((role) => role !== user.role)
          .map((role) => (
            <DropdownMenuItem key={role} onClick={() => handleRole(role)}>
              {t("admin.users.makeRole", { role: t(`roles.${role}`) })}
            </DropdownMenuItem>
          ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant={isBlocking ? "destructive" : "default"}
          onClick={() => setConfirmStatus(true)}
        >
          {t(isBlocking ? "admin.users.block" : "admin.users.unblock")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
