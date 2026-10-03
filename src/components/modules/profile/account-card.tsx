"use client";

import {
  CalendarIcon,
  CircleCheckIcon,
  CircleXIcon,
  MailIcon,
  ShieldCheckIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import Panel from "@/components/ui/panel";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { Me } from "@/types";
import { formatDate } from "@/utils";

export default function AccountCard({ me }: { me: Me }) {
  const t = useT();
  const locale = useLocale();
  const isGoogle = me.authProvider.toUpperCase() === "GOOGLE";

  const rows: [string, ReactNode][] = [
    [
      t("profile.role"),
      <>
        <ShieldCheckIcon className="size-4 text-primary" />
        {t(`status.${me.role}`)}
      </>,
    ],
    [
      t("profile.sign_in_method"),
      <>
        <MailIcon className="size-4 text-muted-foreground" />
        {isGoogle ? t("profile.google") : t("profile.password")}
      </>,
    ],
    [
      t("profile.emailVerified"),
      me.emailVerified ? (
        <>
          <CircleCheckIcon className="size-4 text-(--tone-g-fg)" />
          {t("profile.yes")}
        </>
      ) : (
        <>
          <CircleXIcon className="size-4 text-(--tone-a-fg)" />
          {t("profile.no")}
        </>
      ),
    ],
    [
      t("profile.memberSince"),
      <>
        <CalendarIcon className="size-4 text-muted-foreground" />
        {formatDate(me.createdAt, locale)}
      </>,
    ],
  ];

  return (
    <Panel flush title={t("profile.accountTitle")}>
      <dl>
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-3 border-b px-5 py-2.5 text-[13px] last:border-0"
          >
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="flex items-center gap-1.5 font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}
