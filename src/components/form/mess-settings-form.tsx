"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FieldGroup } from "@/components/ui/field";
import { useUpdateMess } from "@/hooks";
import { useT } from "@/i18n/i18n-provider";
import type { MessDetail } from "@/types";
import { getErrorMessage, toNumber } from "@/utils";
import { messSchema } from "@/validation";
import { applyServerErrors, useAppForm } from ".";

export default function MessSettingsForm({ mess }: { mess: MessDetail }) {
  const t = useT();
  const router = useRouter();

  const { mutate: updateMess, isPending } = useUpdateMess();

  const form = useAppForm({
    defaultValues: {
      name: mess.name,
      address: mess.address,
      monthlyRent: String(toNumber(mess.monthlyRent)),
      monthlyDeposit: String(toNumber(mess.monthlyDeposit)),
    },
    validators: { onChange: messSchema },
    onSubmit: ({ value }) => {
      updateMess(
        { messId: mess.id, ...messSchema.parse(value) },
        {
          onSuccess: () => {
            toast.success(t("toast.messUpdated"));
            // The mess switcher in the header is rendered on the server.
            router.refresh();
          },
          onError: (err) => {
            toast.error(t.dynamic(getErrorMessage(err)));
            applyServerErrors(form, err);
          },
        },
      );
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
        <form.AppField name="name">
          {(field) => <field.TextField label={t("manager.settings.name")} />}
        </form.AppField>
        <form.AppField name="address">
          {(field) => (
            <field.TextareaField
              label={t("manager.settings.address")}
              rows={3}
            />
          )}
        </form.AppField>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.AppField name="monthlyRent">
            {(field) => (
              <field.TextField
                label={t("manager.settings.rent")}
                description={t("manager.settings.rentHint")}
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
              />
            )}
          </form.AppField>
          <form.AppField name="monthlyDeposit">
            {(field) => (
              <field.TextField
                label={t("manager.settings.deposit")}
                description={t("manager.settings.depositHint")}
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
              />
            )}
          </form.AppField>
        </div>
        <div>
          <form.AppForm>
            <form.SubmitButton
              isPending={isPending}
              pendingLabel={t("manager.settings.saving")}
            >
              {t("manager.settings.save")}
            </form.SubmitButton>
          </form.AppForm>
        </div>
      </FieldGroup>
    </form>
  );
}
