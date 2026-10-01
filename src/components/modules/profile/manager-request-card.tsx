"use client";

import { ClipboardListIcon } from "lucide-react";
import ManagerRequestForm from "@/components/form/manager-request-form";
import Panel from "@/components/ui/panel";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { Me } from "@/types";
import { formatDate } from "@/utils";

/** A member's way to run a mess: ask, wait for the admin, or try again. */
export default function ManagerRequestCard({ me }: { me: Me }) {
  const t = useT();
  const locale = useLocale();

  const latest = me.managerApplications?.[0];

  return (
    <Panel
      title={t("profile.managerRequest.title")}
      icon={<ClipboardListIcon className="size-4 text-muted-foreground" />}
    >
      {latest?.status === "PENDING" ? (
        <div className="tone-b flex flex-col gap-1 rounded-lg border px-3 py-2.5 text-[13px]">
          <p className="font-medium">
            {t("profile.managerRequest.pendingTitle")}
          </p>
          <p>
            {t("profile.managerRequest.pendingBody", {
              mess: latest.messName,
              date: formatDate(latest.createdAt, locale),
            })}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {latest?.status === "REJECTED" ? (
            <div className="tone-r flex flex-col gap-1 rounded-lg border px-3 py-2.5 text-[13px]">
              <p className="font-medium">
                {t("profile.managerRequest.rejectedTitle")}
              </p>
              <p>
                {t("profile.managerRequest.rejectedBody", {
                  mess: latest.messName,
                })}
              </p>
              {latest.rejectionReason && (
                <p>
                  {t("profile.managerRequest.reason", {
                    reason: latest.rejectionReason,
                  })}
                </p>
              )}
              <p>{t("profile.managerRequest.tryAgain")}</p>
            </div>
          ) : (
            <p className="text-[13px] text-muted-foreground">
              {t("profile.managerRequest.body")}
            </p>
          )}
          <ManagerRequestForm />
        </div>
      )}
    </Panel>
  );
}
