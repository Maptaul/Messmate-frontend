"use client";

import { SendIcon } from "lucide-react";
import { toast } from "sonner";
import { FieldGroup } from "@/components/ui/field";
import { useApplyForManager } from "@/hooks";
import { useT } from "@/i18n/i18n-provider";
import { getErrorMessage } from "@/utils";
import { managerRequestSchema } from "@/validation";
import { applyServerErrors, useAppForm } from ".";

export default function ManagerRequestForm() {
  const t = useT();

  const { mutate: apply, isPending } = useApplyForManager();

  const form = useAppForm({
    defaultValues: { messName: "", messAddress: "" },
    validators: { onChange: managerRequestSchema },
    onSubmit: ({ value }) => {
      apply(managerRequestSchema.parse(value), {
        onSuccess: () => {
          toast.success(t("toast.requestSent"));
          form.reset();
        },
        onError: (err) => {
          toast.error(t.dynamic(getErrorMessage(err)));
          applyServerErrors(form, err);
        },
      });
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
      <FieldGroup className="gap-4">
        <form.AppField name="messName">
          {(field) => (
            <field.TextField
              label={t("auth.register.messName")}
              autoComplete="organization"
            />
          )}
        </form.AppField>
        <form.AppField name="messAddress">
          {(field) => (
            <field.TextField
              label={t("auth.register.messAddress")}
              description={t("auth.register.messAddressHint")}
              autoComplete="street-address"
            />
          )}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton
            size="sm"
            className="self-start"
            isPending={isPending}
            pendingLabel={t("profile.managerRequest.submitting")}
          >
            <SendIcon />
            {t("profile.managerRequest.submit")}
          </form.SubmitButton>
        </form.AppForm>
      </FieldGroup>
    </form>
  );
}
