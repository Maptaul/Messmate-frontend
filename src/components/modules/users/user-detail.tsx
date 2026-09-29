"use client";

import Link from "next/link";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StatusBadge from "@/components/ui/status-badge";
import UserAvatar from "@/components/ui/user-avatar";
import { useGetMe, useSuspenseUser } from "@/hooks";
import { useLocale, useLocalePath, useT } from "@/i18n/i18n-provider";
import { formatDate } from "@/utils";
import UserActions from "./user-actions";

export default function UserDetail({ userId }: { userId: string }) {
  const t = useT();
  const locale = useLocale();
  const href = useLocalePath();

  const { data } = useSuspenseUser(userId);
  const { data: me } = useGetMe();

  const user = data.data;
  const isSelf = user.id === me?.data.id;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.userDetail.accountTitle")}</CardTitle>
          <CardAction>
            {isSelf ? (
              <span className="text-xs text-muted-foreground">
                {t("admin.userDetail.yourself")}
              </span>
            ) : (
              <UserActions user={user} />
            )}
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-4">
          <UserAvatar
            name={user.name}
            src={user.avatarUrl}
            className="size-16 text-lg"
          />
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">
                {t("admin.userDetail.role")}
              </dt>
              <dd>
                <StatusBadge status={user.role} />
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">
                {t("admin.userDetail.status")}
              </dt>
              <dd>
                <StatusBadge status={user.status} />
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">
                {t("admin.userDetail.email")}
              </dt>
              <dd>
                {user.emailVerified
                  ? t("admin.userDetail.verified")
                  : t("admin.userDetail.notVerified")}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">
                {t("admin.userDetail.phone")}
              </dt>
              <dd>{user.phone ?? "—"}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">
                {t("admin.userDetail.signIn")}
              </dt>
              <dd>
                {user.authProvider === "google"
                  ? t("profile.google")
                  : t("profile.password")}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">
                {t("admin.userDetail.joined")}
              </dt>
              <dd>{formatDate(user.createdAt, locale)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.userDetail.managedTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            {user.managedMesses.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t("admin.userDetail.managedEmpty")}
              </p>
            ) : (
              <ul className="divide-y">
                {user.managedMesses.map((mess) => (
                  <li key={mess.id} className="py-2 first:pt-0 last:pb-0">
                    <Link
                      href={href(`/admin/messes/${mess.id}`)}
                      className="font-medium underline-offset-4 hover:underline"
                    >
                      {mess.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("admin.userDetail.membershipsTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            {user.memberships.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t("admin.userDetail.membershipsEmpty")}
              </p>
            ) : (
              <ul className="divide-y">
                {user.memberships.map((membership) => (
                  <li
                    key={membership.id}
                    className="flex flex-wrap items-center justify-between gap-2 py-2 first:pt-0 last:pb-0"
                  >
                    <Link
                      href={href(`/admin/messes/${membership.mess.id}`)}
                      className="font-medium underline-offset-4 hover:underline"
                    >
                      {membership.mess.name}
                    </Link>
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                      {t("admin.userDetail.joinedOn", {
                        date: formatDate(membership.joinedAt, locale),
                      })}
                      <StatusBadge status={membership.status} />
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
