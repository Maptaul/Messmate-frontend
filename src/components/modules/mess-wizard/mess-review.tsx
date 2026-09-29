"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { addMember } from "@/api";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useCreateMess } from "@/hooks";
import { useLocalePath, useT } from "@/i18n/i18n-provider";
import { useMessWizard } from "@/stores/mess-wizard.store";
import { formatBDT, getErrorMessage, rememberActiveMess } from "@/utils";

export default function MessReview() {
  const t = useT();
  const href = useLocalePath();
  const router = useRouter();
  const { details, money, memberEmails, setStep, reset } = useMessWizard();
  const [addingMembers, setAddingMembers] = useState(false);

  const { mutate: createMess, isPending } = useCreateMess();

  const busy = isPending || addingMembers;

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
          const failed: string[] = [];
          for (const email of memberEmails) {
            try {
              await addMember({ messId: mess.id, email });
            } catch {
              failed.push(email);
            }
          }

          rememberActiveMess(mess.id);
          reset();
          toast.success(t("toast.messCreated", { name: mess.name }));
          if (failed.length > 0) {
            toast.warning(
              t("manager.wizard.someMembersFailed", {
                name: mess.name,
                emails: failed.join(", "),
              }),
            );
          }
          router.replace(href("/manager"));
          router.refresh();
        },
        onError: (err) => {
          toast.error(t.dynamic(getErrorMessage(err)));
        },
      },
    );
  };

  const rows = [
    [t("manager.wizard.name"), details.name],
    [t("manager.wizard.address"), details.address],
    [t("manager.wizard.rent"), formatBDT(money.monthlyRent)],
    [t("manager.wizard.deposit"), formatBDT(money.monthlyDeposit)],
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">
        {t("manager.wizard.reviewTitle")}
      </h2>
      <dl className="divide-y rounded-lg border text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 px-3 py-2">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="text-right font-medium break-words">{value}</dd>
          </div>
        ))}
        <div className="px-3 py-2">
          <dt className="text-muted-foreground">
            {memberEmails.length > 0
              ? t("manager.wizard.reviewMembers", {
                  count: memberEmails.length,
                })
              : t("manager.wizard.reviewNoMembers")}
          </dt>
          {memberEmails.length > 0 && (
            <dd className="mt-1 break-all">{memberEmails.join(", ")}</dd>
          )}
        </div>
      </dl>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => setStep(2)}
          >
            <ArrowLeftIcon />
            {t("manager.wizard.back")}
          </Button>
          <Button type="button" variant="ghost" disabled={busy} onClick={reset}>
            {t("manager.wizard.startOver")}
          </Button>
        </div>
        <Button type="button" disabled={busy} onClick={handleCreate}>
          {busy && <Spinner />}
          {busy ? t("manager.wizard.creating") : t("manager.wizard.create")}
        </Button>
      </div>
    </div>
  );
}
