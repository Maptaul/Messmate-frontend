"use client";

import StepNav from "@/components/modules/mess-wizard/step-nav";
import { FieldGroup } from "@/components/ui/field";
import { useT } from "@/i18n/i18n-provider";
import { useMessWizard } from "@/stores/mess-wizard.store";
import { messDetailsSchema } from "@/validation";
import { useAppForm } from ".";

export default function MessDetailsForm() {
  const t = useT();
  const { details, setDetails, setStep } = useMessWizard();

  const form = useAppForm({
    defaultValues: details,
    validators: { onChange: messDetailsSchema },
    onSubmit: ({ value }) => {
      setDetails(messDetailsSchema.parse(value));
      setStep(1);
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
          {(field) => (
            <field.TextField
              label={t("manager.wizard.name")}
              placeholder={t("manager.wizard.namePlaceholder")}
            />
          )}
        </form.AppField>
        <form.AppField name="address">
          {(field) => (
            <field.TextareaField
              label={t("manager.wizard.address")}
              placeholder={t("manager.wizard.addressPlaceholder")}
              rows={3}
            />
          )}
        </form.AppField>
        <StepNav />
      </FieldGroup>
    </form>
  );
}
