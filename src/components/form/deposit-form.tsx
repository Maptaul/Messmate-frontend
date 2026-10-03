"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { useActiveMembers, useAddDeposit, useUpdateDeposit } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import type { Deposit } from "@/types";
import { formatBDT, getErrorMessage } from "@/utils";
import { depositSchema } from "@/validation";
import { applyServerErrors, useAppForm } from ".";

export default function DepositForm({
  cycleId,
  messId,
  deposit,
  handleClose,
}: {
  cycleId: string;
  messId: string;
  deposit?: Deposit;
  handleClose: () => void;
}) {
  const t = useT();
  const locale = useLocale();

  const { data: members } = useActiveMembers(messId);
  const { mutate: addDeposit, isPending: addPending } = useAddDeposit();
  const { mutate: updateDeposit, isPending: updatePending } =
    useUpdateDeposit();

  const form = useAppForm({
    defaultValues: {
      memberId: deposit?.member.id ?? "",
      amount: deposit ? String(Number(deposit.amount)) : "",
      note: deposit?.note ?? "",
    },
    // Editing keeps the member, which is prefilled, so one schema covers both.
    validators: { onChange: depositSchema },
    onSubmit: ({ value }) => {
      const parsed = depositSchema.parse(value);

      const callbacks = {
        onSuccess: () => {
          toast.success(
            deposit
              ? t("toast.saved")
              : t("toast.depositAdded", {
                  amount: formatBDT(parsed.amount, locale),
                  name:
                    members?.data.find(
                      (member) => member.id === parsed.memberId,
                    )?.user.name ?? "",
                }),
          );
          handleClose();
        },
        onError: (err: unknown) => {
          toast.error(t.dynamic(getErrorMessage(err)));
          applyServerErrors(form, err);
        },
      };

      if (deposit) {
        updateDeposit(
          {
            depositId: deposit.id,
            amount: parsed.amount,
            note: parsed.note || undefined,
          },
          callbacks,
        );
      } else {
        addDeposit(
          {
            cycleId,
            memberId: parsed.memberId,
            amount: parsed.amount,
            note: parsed.note || undefined,
          },
          callbacks,
        );
      }
    },
  });

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        {!deposit && (
          <form.AppField name="memberId">
            {(field) => (
              <field.SelectField
                label={t("manager.deposits.formMember")}
                placeholder={t("manager.deposits.selectMember")}
                options={(members?.data ?? []).map((member) => ({
                  value: member.id,
                  label: member.user.name,
                }))}
              />
            )}
          </form.AppField>
        )}
        <form.AppField name="amount">
          {(field) => (
            <field.MoneyField label={t("manager.deposits.formAmount")} />
          )}
        </form.AppField>
        <form.AppField name="note">
          {(field) => (
            <field.TextareaField
              label={t("manager.deposits.formNote")}
              rows={2}
            />
          )}
        </form.AppField>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            {t("manager.deposits.cancel")}
          </Button>
          <form.AppForm>
            <form.SubmitButton isPending={addPending || updatePending}>
              {t("manager.deposits.submit")}
            </form.SubmitButton>
          </form.AppForm>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
}
