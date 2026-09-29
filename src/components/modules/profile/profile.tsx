"use client";

import ProfileForm from "@/components/form/profile-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe } from "@/hooks";
import { useT } from "@/i18n/i18n-provider";
import AccountCard from "./account-card";
import AvatarCard from "./avatar-card";

export default function Profile() {
  const t = useT();

  // The dashboard layout already fetched /auth/me and hydrated it.
  const { data } = useGetMe();

  const me = data?.data;

  if (!me) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl lg:col-span-2" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6">
        <AvatarCard me={me} />
        <AccountCard me={me} />
      </div>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>{t("profile.detailsTitle")}</CardTitle>
          <CardDescription>{t("profile.nameChangedNote")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm me={me} />
        </CardContent>
      </Card>
    </div>
  );
}
