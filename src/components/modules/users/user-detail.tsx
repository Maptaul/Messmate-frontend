"use client";

import {
  BanIcon,
  CalendarIcon,
  ChevronRightIcon,
  InfoIcon,
  KeyRoundIcon,
  LockOpenIcon,
  MailIcon,
  PhoneIcon,
  UserCogIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import PageCrumb from "@/components/dashboard/page-crumb";
import { Button } from "@/components/ui/button";
import InlineConfirm from "@/components/ui/inline-confirm";
import Panel from "@/components/ui/panel";
import StatusBadge from "@/components/ui/status-badge";
import UserAvatar from "@/components/ui/user-avatar";
import { useGetMe, useSuspenseUser, useUpdateUserStatus } from "@/hooks";
import { useLocale, useLocalePath, useT } from "@/i18n/i18n-provider";
import { formatDate, getErrorMessage } from "@/utils";
import ChangeRoleDialog from "./change-role-dialog";

export default function UserDetail({ userId }: { userId: string }) {
  const t = useT();
  const locale = useLocale();
  const href = useLocalePath();
  const [confirmBlock, setConfirmBlock] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);

  const { data } = useSuspenseUser(userId);
  const { data: me } = useGetMe();
  const { mutate: updateStatus, isPending } = useUpdateUserStatus();

  const user = data.data;
  const isSelf = user.id === me?.data.id;
  const isBlocked = user.status === "BLOCKED";

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

  return (
    <>
      <PageCrumb label={user.name} />
      <div className="flex flex-wrap items-start gap-5 rounded-xl border bg-card p-6 shadow-1">
        <UserAvatar
          name={user.name}
          src={user.avatarUrl}
          className="size-18 [&_[data-slot=avatar-fallback]]:text-2xl [&_[data-slot=avatar-fallback]]:font-bold"
        />
        <div className="flex min-w-55 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-[-0.015em]">
              {user.name}
            </h1>
            <StatusBadge status={user.role} />
            <StatusBadge status={user.status} />
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-x-6 gap-y-2 text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MailIcon className="size-4" />
              {user.email}
            </span>
            <span className="flex items-center gap-1.5">
              <PhoneIcon className="size-4" />
              {user.phone ?? "—"}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="size-4" />
              {t("admin.userDetail.joinedOn", {
                date: formatDate(user.createdAt, locale),
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <KeyRoundIcon className="size-4" />
              {user.authProvider === "GOOGLE"
                ? t("admin.users.providerGoogle")
                : t("admin.users.providerEmail")}
              {" · "}
              {user.emailVerified
                ? t("admin.userDetail.verified")
                : t("admin.userDetail.notVerified")}
            </span>
          </div>
        </div>
        {isSelf ? (
          <span className="flex h-8 items-center gap-1.5 rounded-lg bg-muted px-3 text-[13px] text-muted-foreground">
            <InfoIcon className="size-4" />
            {t("admin.userDetail.yourself")}
          </span>
        ) : confirmBlock ? (
          <InlineConfirm
            hint={t("admin.userDetail.blockHint")}
            confirmLabel={t("admin.users.block")}
            onConfirm={handleStatus}
            onCancel={() => setConfirmBlock(false)}
            pending={isPending}
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setRoleOpen(true)}>
              <UserCogIcon />
              {t("admin.users.changeRole")}
            </Button>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() =>
                isBlocked ? handleStatus() : setConfirmBlock(true)
              }
            >
              {isBlocked ? <LockOpenIcon /> : <BanIcon />}
              {t(isBlocked ? "admin.users.unblock" : "admin.users.block")}
            </Button>
          </div>
        )}
      </div>
      <ChangeRoleDialog
        user={user}
        open={roleOpen}
        onOpenChange={setRoleOpen}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Panel flush title={t("admin.userDetail.managedTitle")}>
          {user.managedMesses.length === 0 ? (
            <p className="px-5 py-6 text-muted-foreground">
              {t("admin.userDetail.managedEmpty")}
            </p>
          ) : (
            <ul>
              {user.managedMesses.map((mess) => (
                <li key={mess.id} className="border-b last:border-0">
                  <Link
                    href={href(`/admin/messes/${mess.id}`)}
                    className="flex items-center justify-between gap-3 px-5 py-3 font-medium transition-colors hover:bg-accent"
                  >
                    {mess.name}
                    <ChevronRightIcon className="size-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel flush title={t("admin.userDetail.membershipsTitle")}>
          {user.memberships.length === 0 ? (
            <p className="px-5 py-6 text-muted-foreground">
              {t("admin.userDetail.membershipsEmpty")}
            </p>
          ) : (
            <ul>
              {user.memberships.map((membership) => (
                <li key={membership.id} className="border-b last:border-0">
                  <Link
                    href={href(`/admin/messes/${membership.mess.id}`)}
                    className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-accent"
                  >
                    <span className="grid leading-tight">
                      <span className="font-medium">
                        {membership.mess.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {t("admin.userDetail.joinedOn", {
                          date: formatDate(membership.joinedAt, locale),
                        })}
                      </span>
                    </span>
                    <StatusBadge status={membership.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
