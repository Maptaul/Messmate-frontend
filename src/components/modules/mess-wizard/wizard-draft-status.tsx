"use client";

import { CloudCheckIcon } from "lucide-react";
import { useT } from "@/i18n/i18n-provider";
import { useMessWizard } from "@/stores/mess-wizard.store";

export default function WizardDraftStatus({
  prefill,
}: {
  prefill?: { name: string; address: string };
}) {
  const t = useT();
  const hasDraft = useMessWizard(({ step, details, money, memberEmails }) => {
    // The approved request's name and address are filled in for them, not typed.
    const typedDetails =
      (details.name !== "" || details.address !== "") &&
      (details.name !== (prefill?.name ?? "") ||
        details.address !== (prefill?.address ?? ""));
    return (
      step > 0 ||
      typedDetails ||
      money.monthlyRent !== "" ||
      money.monthlyDeposit !== "0" ||
      memberEmails.length > 0
    );
  });

  if (!hasDraft) return null;

  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <CloudCheckIcon className="size-3.5" />
      {t("manager.wizard.draftSaved")}
    </span>
  );
}
