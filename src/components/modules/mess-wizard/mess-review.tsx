"use client";

import { useState } from "react";
import { toast } from "sonner";
import { inviteMember } from "@/api";
import { useCreateMess } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { useMessWizard } from "@/stores/mess-wizard.store";
import {
  formatBDT,
  getErrorMessage,
  rememberActiveMess,
  toNumber,
} from "@/utils";
import type { CreatedMess } from "./mess-created";
import StepNav, { StepCard } from "./step-nav";

export default function MessReview({
  onCreated,
}: {
  onCreated: (created: CreatedMess) => void;
}) {
  const t = useT();
  const locale = useLocale();
  const { details, money, memberEmails, setStep, reset } = useMessWizard();
  const [addingMembers, setAddingMembers] = useState(false);

  const { mutate: createMess, isPending } = useCreateMess();

  const handleCreate = () => {
    createMess(
      {
        name: details.name,
        address: details.address,
        monthlyRent: Number(money.monthlyRent),
        monthlyDeposit: Number(money.monthlyDeposit),
      },
      {
        onSuccess: async (res) => {
          const mess = res.data;
          setAddingMembers(true);

          // The mess exists now; one bad email must not undo it.
          const results: CreatedMess["results"] = [];
          for (const email of memberEmails) {
            try {
              await inviteMember({ messId: mess.id, email });
              results.push({ email });
            } catch (err) {
              results.push({ email, error: getErrorMessage(err) });
            }
          }

          rememberActiveMess(mess.id);
          reset();
          toast.success(t("toast.messCreated", { name: mess.name }));
          onCreated({ name: mess.name, results });
        },
        onError: (err) => {
          toast.error(t.dynamic(getErrorMessage(err)));
        },
      },
    );
  };

  const deposit = toNumber(money.monthlyDeposit);
  const rows = [
    [t("manager.wizard.name"), details.name],
    [t("manager.wizard.address"), details.address],
    [t("manager.wizard.rent"), formatBDT(money.monthlyRent, locale)],
    [
      t("manager.wizard.deposit"),
      deposit > 0 ? formatBDT(deposit, locale) : "—",
    ],
    [t("manager.wizard.members"), memberEmails.join(", ") || "—"],
  ];

  return (
    <div className="flex flex-col gap-2">
      <StepCard title={t("manager.wizard.reviewTitle")}>
        <dl className="overflow-hidden rounded-xl border">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="grid grid-cols-[140px_1fr] gap-3 border-b px-3.5 py-2.5 last:border-0"
            >
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="font-medium break-words">{value}</dd>
            </div>
          ))}
        </dl>
      </StepCard>
      <StepNav
        onBack={() => setStep(2)}
        onNext={handleCreate}
        nextLabel={
          isPending || addingMembers
            ? t("manager.wizard.creating")
            : t("manager.wizard.create")
        }
        pending={isPending || addingMembers}
      />
    </div>
  );
}
