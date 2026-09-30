"use client";

import { InfoIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RadioCards from "@/components/ui/radio-cards";
import { useUpdateUserRole, useUserDetail } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { User, UserRole } from "@/types";
import { formatNumber, getErrorMessage } from "@/utils";

const roles: UserRole[] = ["ADMIN", "MESS_MANAGER", "MEMBER"];

/** Radio cards per role; a manager who still owns a mess can't be demoted. */
export default function ChangeRoleDialog({
  user,
  open,
  onOpenChange,
}: {
  user: Pick<User, "id" | "name" | "email" | "role">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useT();
  const locale = useLocale();
  const [role, setRole] = useState<UserRole>(user.role);

  const { data } = useUserDetail(user.id, open);
  const { mutate: updateRole, isPending } = useUpdateUserRole();

  const managed = data?.data.managedMesses ?? [];
  const blocked =
    user.role === "MESS_MANAGER" &&
    role !== "MESS_MANAGER" &&
    managed.length > 0;

  const handleSave = () => {
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
          onOpenChange(false);
        },
        onError: (err) => {
          toast.error(t.dynamic(getErrorMessage(err)));
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) setRole(user.role);
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-115">
        <DialogHeader>
          <DialogTitle>{t("admin.users.changeRole")}</DialogTitle>
          <DialogDescription>
            {user.name} · {user.email}
          </DialogDescription>
        </DialogHeader>
        <RadioCards
          label={t("admin.users.changeRole")}
          value={role}
          onChange={setRole}
          options={roles.map((value) => ({
            value,
            label: t(`status.${value}`),
            hint: t(`admin.users.roleHints.${value}`),
          }))}
        />
        {blocked && (
          <div
            role="alert"
            className="tone-a flex gap-2 rounded-xl border px-3 py-2.5"
          >
            <InfoIcon className="mt-0.5 size-4 shrink-0" />
            <span>
              {managed.length === 1
                ? t("admin.users.roleBlocked", {
                    name: user.name,
                    mess: managed[0].name,
                  })
                : t("admin.users.roleBlockedMany", {
                    name: user.name,
                    count: formatNumber(managed.length, locale),
                  })}
            </span>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleSave}
            disabled={blocked || isPending || role === user.role}
          >
            {t("admin.users.saveRole")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
