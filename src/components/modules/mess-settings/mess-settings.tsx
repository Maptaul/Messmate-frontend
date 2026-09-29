"use client";

import MessSettingsForm from "@/components/form/mess-settings-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSuspenseMess } from "@/hooks";
import { useT } from "@/i18n/i18n-provider";
import DeleteMessDialog from "./delete-mess-dialog";

export default function MessSettings({ messId }: { messId: string }) {
  const t = useT();

  const { data } = useSuspenseMess(messId);

  const mess = data.data;

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("manager.settings.detailsTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Re-keyed so a saved value replaces the draft. */}
          <MessSettingsForm
            key={`${mess.name}|${mess.address}|${mess.monthlyRent}|${mess.monthlyDeposit}`}
            mess={mess}
          />
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive">
            {t("manager.settings.dangerTitle")}
          </CardTitle>
          <CardDescription>{t("manager.settings.dangerBody")}</CardDescription>
        </CardHeader>
        <CardContent>
          <DeleteMessDialog mess={mess} />
        </CardContent>
      </Card>
    </div>
  );
}
