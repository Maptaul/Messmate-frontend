"use client";

import { DoorOpenIcon } from "lucide-react";
import JoinMessForm from "@/components/form/join-mess-form";
import Panel from "@/components/ui/panel";
import { useT } from "@/i18n/i18n-provider";

export default function JoinMessCard() {
  const t = useT();

  return (
    <Panel
      title={t("membership.joinTitle")}
      icon={<DoorOpenIcon className="size-4 text-muted-foreground" />}
    >
      <div className="flex flex-col gap-3">
        <p className="text-[13px] text-muted-foreground">
          {t("membership.joinBody")}
        </p>
        <JoinMessForm />
      </div>
    </Panel>
  );
}
