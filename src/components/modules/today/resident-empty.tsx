import { CalendarClockIcon, HomeIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import JoinMessCard from "@/components/modules/membership/join-mess-card";
import MyMembershipRequests from "@/components/modules/membership/my-membership-requests";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";
import { getMeOnServer } from "@/lib/activeMess";

/** Shown to a resident who isn't in a mess yet, or whose mess has no open month. */
export default async function ResidentEmpty({
  kind,
}: {
  kind: "no-mess" | "no-cycle";
}) {
  const t = await getT();
  const key = kind === "no-mess" ? "resident.noMess" : "resident.noCycle";

  // Not in a mess yet: a member can join one, or ask to run one.
  let action: ReactNode;
  let isMember = false;
  if (kind === "no-mess") {
    const [me, locale] = await Promise.all([getMeOnServer(), getLocale()]);
    const latest = me?.data.managerApplications?.[0];
    isMember = me?.data.role === "MEMBER";

    if (latest?.status === "PENDING") {
      action = (
        <p className="tone-b rounded-lg border px-3 py-2 text-[13px]">
          {t("resident.noMess.pending", { mess: latest.messName })}
        </p>
      );
    } else if (isMember) {
      action = (
        <Button
          variant="outline"
          size="sm"
          render={<Link href={localePath(locale, "/profile")} />}
          nativeButton={false}
        >
          {t("resident.noMess.runAMess")}
        </Button>
      );
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border">
        <EmptyState
          icon={kind === "no-mess" ? HomeIcon : CalendarClockIcon}
          title={t(`${key}.title`)}
          description={t(`${key}.body`)}
          action={action}
        />
      </div>
      {isMember && (
        <div className="grid items-start gap-4 lg:grid-cols-2">
          <JoinMessCard />
          <MyMembershipRequests />
        </div>
      )}
    </div>
  );
}
