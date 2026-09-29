"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/ui/status-badge";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { Me } from "@/types";
import { formatDate } from "@/utils";

export default function AccountCard({ me }: { me: Me }) {
  const t = useT();
  const locale = useLocale();

  const messes =
    me.role === "MESS_MANAGER"
      ? me.managedMesses.map(({ id, name }) => ({ id, name }))
      : me.memberships
          .filter((membership) => membership.status === "ACTIVE")
          .map(({ mess }) => ({ id: mess.id, name: mess.name }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("profile.accountTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">{t("profile.role")}</dt>
            <dd>
              <StatusBadge status={me.role} />
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">
              {t("profile.memberSince")}
            </dt>
            <dd>{formatDate(me.createdAt, locale)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">
              {t("profile.sign_in_method")}
            </dt>
            <dd>
              {me.authProvider === "google"
                ? t("profile.google")
                : t("profile.password")}
            </dd>
          </div>
          {me.role !== "ADMIN" && (
            <div>
              <dt className="text-muted-foreground">{t("profile.messes")}</dt>
              <dd className="mt-1 font-medium">
                {messes.length > 0
                  ? messes.map((mess) => mess.name).join(", ")
                  : t("profile.noMesses")}
              </dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  );
}
