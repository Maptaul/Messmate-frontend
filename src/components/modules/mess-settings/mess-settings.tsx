"use client";

import MessSettingsForm from "@/components/form/mess-settings-form";
import { useSuspenseMess } from "@/hooks";
import { useT } from "@/i18n/i18n-provider";
import DeleteMessDialog from "./delete-mess-dialog";

export default function MessSettings({ messId }: { messId: string }) {
  const t = useT();

  const { data } = useSuspenseMess(messId);

  const mess = data.data;

  return (
    <div className="flex w-full max-w-180 flex-col gap-5">
      <div className="rounded-xl border bg-card p-6 shadow-1">
        {/* Re-keyed so a saved value replaces the draft. */}
        <MessSettingsForm
          key={`${mess.name}|${mess.address}|${mess.monthlyRent}|${mess.monthlyDeposit}`}
          mess={mess}
        />
      </div>

      <div className="tone-r flex flex-col gap-3 rounded-xl border bg-transparent p-5">
        <p className="font-semibold">{t("manager.settings.danger")}</p>
        <div className="flex flex-wrap items-center justify-between gap-3 text-foreground">
          <div className="min-w-55 flex-1">
            <p className="font-medium">{t("manager.settings.dangerTitle")}</p>
            <p className="text-[13px] text-pretty text-muted-foreground">
              {t("manager.settings.dangerBody")}
            </p>
          </div>
          <DeleteMessDialog mess={mess} />
        </div>
      </div>
    </div>
  );
}
