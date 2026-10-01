"use client";

import { MailIcon } from "lucide-react";
import { toast } from "sonner";
import { useAppForm } from "@/components/form";
import { FieldGroup } from "@/components/ui/field";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { formatNumber } from "@/utils";
import { contactSchema } from "@/validation";

/**
 * There is no contact endpoint on the API, and a form that claims "sent" when
 * nothing was sent would be a lie. So this composes the message and hands it
 * to the visitor's own email app.
 */
export default function ContactForm({ to }: { to: string }) {
  const t = useT();
  const locale = useLocale();

  const form = useAppForm({
    defaultValues: { name: "", email: "", subject: "", message: "" },
    validators: { onChange: contactSchema },
    onSubmit: ({ value }) => {
      const { name, email, subject, message } = contactSchema.parse(value);
      const body = `${message}\n\n— ${name} (${email})`;
      window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      toast.success(t("marketing.contact.sent", { email: to }));
    },
  });

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.AppField name="name">
            {(field) => (
              <field.TextField
                label={t("marketing.contact.name")}
                autoComplete="name"
              />
            )}
          </form.AppField>
          <form.AppField name="email">
            {(field) => (
              <field.TextField
                label={t("marketing.contact.email")}
                type="email"
                autoComplete="email"
              />
            )}
          </form.AppField>
        </div>
        <form.AppField name="subject">
          {(field) => (
            <field.TextField
              label={t("marketing.contact.subject")}
              placeholder={t("marketing.contact.subjectPlaceholder")}
            />
          )}
        </form.AppField>
        <form.AppField name="message">
          {(field) => (
            <field.TextareaField
              label={t("marketing.contact.message")}
              description={t("marketing.contact.messageHint", {
                count: formatNumber(field.state.value.length, locale),
              })}
              rows={6}
            />
          )}
        </form.AppField>
        <div className="flex flex-col gap-2">
          <form.AppForm>
            <form.SubmitButton size="lg" className="w-full">
              <MailIcon />
              {t("marketing.contact.send")}
            </form.SubmitButton>
          </form.AppForm>
          <p className="text-center text-xs text-muted-foreground">
            {t("marketing.contact.sendHint")}
          </p>
        </div>
      </FieldGroup>
    </form>
  );
}
