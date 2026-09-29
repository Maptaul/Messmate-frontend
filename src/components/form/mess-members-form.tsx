"use client";

import { XIcon } from "lucide-react";
import StepNav from "@/components/modules/mess-wizard/step-nav";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/i18n-provider";
import { useMessWizard } from "@/stores/mess-wizard.store";
import { addMemberSchema } from "@/validation";
import { useAppForm } from ".";

export default function MessMembersForm() {
  const t = useT();
  const { memberEmails, addEmail, removeEmail, setStep } = useMessWizard();

  const form = useAppForm({
    defaultValues: { email: "" },
    validators: {
      onChange: addMemberSchema.refine(
        ({ email }) => !memberEmails.includes(email.trim().toLowerCase()),
        { message: "manager.wizard.duplicate", path: ["email"] },
      ),
    },
    onSubmit: ({ value, formApi }) => {
      addEmail(value.email.trim().toLowerCase());
      formApi.reset();
    },
  });

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">
          {t("manager.wizard.membersTitle")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("manager.wizard.membersHint")}
        </p>
      </div>

      <form
        noValidate
        className="flex items-start gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="flex-1">
          <form.AppField name="email">
            {(field) => (
              <field.TextField
                label={t("manager.wizard.memberEmail")}
                type="email"
                autoComplete="off"
                placeholder="name@example.com"
              />
            )}
          </form.AppField>
        </div>
        <Button type="submit" variant="secondary" className="mt-[1.625rem]">
          {t("manager.wizard.addMember")}
        </Button>
      </form>

      {memberEmails.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t("manager.wizard.noneYet")}
        </p>
      ) : (
        <ul className="divide-y rounded-lg border">
          {memberEmails.map((email) => (
            <li
              key={email}
              className="flex items-center justify-between gap-2 px-3 py-2 text-sm"
            >
              <span className="truncate">{email}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={t("manager.wizard.removeMember", { email })}
                onClick={() => removeEmail(email)}
              >
                <XIcon />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <StepNav onBack={() => setStep(1)} onNext={() => setStep(3)} />
    </div>
  );
}
