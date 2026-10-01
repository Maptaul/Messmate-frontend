"use client";

import { KeyRoundIcon, ShieldIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import ProfileForm from "@/components/form/profile-form";
import { Button } from "@/components/ui/button";
import Panel from "@/components/ui/panel";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe } from "@/hooks";
import { useLocalePath, useT } from "@/i18n/i18n-provider";
import AccountCard from "./account-card";
import AvatarCard from "./avatar-card";
import ManagerRequestCard from "./manager-request-card";
import MyMessesCard from "./my-messes-card";

export default function Profile() {
  const t = useT();
  const href = useLocalePath();

  // The page prefetched /auth/me and hydrated it.
  const { data } = useGetMe();

  const me = data?.data;

  if (!me) {
    return (
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Skeleton className="h-96 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  const isGoogle = me.authProvider.toUpperCase() === "GOOGLE";

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <div className="flex flex-col gap-4">
        <AvatarCard me={me} />
        <Panel title={t("profile.detailsTitle")}>
          <ProfileForm me={me} />
        </Panel>
      </div>
      <div className="flex flex-col gap-4">
        <AccountCard me={me} />
        {me.role === "MEMBER" && <ManagerRequestCard me={me} />}
        {me.role !== "ADMIN" && (
          <Suspense fallback={<Skeleton className="h-28 rounded-xl" />}>
            <MyMessesCard />
          </Suspense>
        )}
        <Panel
          title={t("profile.securityTitle")}
          icon={<ShieldIcon className="size-4 text-muted-foreground" />}
        >
          <div className="flex flex-col items-start gap-3">
            <p className="text-[13px] text-muted-foreground">
              {isGoogle
                ? t("profile.securityGoogle")
                : t("profile.securityBody")}
            </p>
            {!isGoogle && (
              <Button
                variant="outline"
                size="sm"
                render={<Link href={href("/forgot-password")} />}
                nativeButton={false}
              >
                <KeyRoundIcon />
                {t("profile.changePassword")}
              </Button>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
