"use client";

import { ArrowLeftIcon, KeyRoundIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { applyServerErrors, useAppForm } from "@/components/form";
import { FieldGroup } from "@/components/ui/field";
import { useForgotPassword, useResetPassword } from "@/hooks";
import { useLocalePath, useT } from "@/i18n/i18n-provider";
import { getErrorMessage } from "@/utils";
import { forgotPasswordSchema, resetPasswordSchema } from "@/validation";

export default function ForgotPasswordForm() {
  const t = useT();
  const href = useLocalePath();
  const [email, setEmail] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4.5">
      <div className="flex flex-col gap-3">
        <span className="grid size-12 place-items-center rounded-xl border bg-muted">
          <KeyRoundIcon className="size-5.5" aria-hidden />
        </span>
        <h1 className="text-[28px] leading-tight font-semibold tracking-tight">
          {email ? t("auth.forgot.resetTitle") : t("auth.forgot.title")}
        </h1>
        <p className="text-foreground-2">
          {email
            ? t("auth.forgot.resetSubtitle", { email })
            : t("auth.forgot.subtitle")}
        </p>
      </div>

      {email ? (
        <ResetStep email={email} onBack={() => setEmail(null)} />
      ) : (
        <EmailStep onSent={setEmail} />
      )}

      <Link
        href={href("/login")}
        className="flex w-fit items-center gap-1.5 font-medium text-foreground-2 hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        {t("auth.forgot.backToLogin")}
      </Link>
    </div>
  );
}

function EmailStep({ onSent }: { onSent: (email: string) => void }) {
  const t = useT();
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const form = useAppForm({
    defaultValues: { email: "" },
    validators: { onChange: forgotPasswordSchema },
    onSubmit: ({ value }) => {
      const email = value.email.trim();
      forgotPassword(email, {
        onSuccess: () => {
          toast.success(t("toast.codeSent", { email }));
          onSent(email);
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
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.AppField name="email">
          {(field) => (
            <field.TextField
              label={t("auth.forgot.email")}
              type="email"
              autoComplete="email"
            />
          )}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton
            isPending={isPending}
            size="lg"
            className="w-full"
            pendingLabel={t("auth.forgot.sending")}
          >
            {t("auth.forgot.send")}
          </form.SubmitButton>
        </form.AppForm>
      </FieldGroup>
    </form>
  );
}

function ResetStep({ email, onBack }: { email: string; onBack: () => void }) {
  const router = useRouter();
  const t = useT();
  const href = useLocalePath();
  const { mutate: resetPassword, isPending } = useResetPassword();

  const form = useAppForm({
    defaultValues: { otp: "", newPassword: "", confirmPassword: "" },
    validators: { onChange: resetPasswordSchema },
    onSubmit: ({ value }) => {
      resetPassword(
        { email, otp: value.otp, newPassword: value.newPassword },
        {
          onSuccess: () => {
            toast.success(t("auth.forgot.changed"));
            router.push(`${href("/login")}?email=${encodeURIComponent(email)}`);
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
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.AppField name="otp">
          {(field) => <field.OtpField label={t("auth.forgot.code")} />}
        </form.AppField>
        <form.AppField name="newPassword">
          {(field) => (
            <field.PasswordField
              label={t("auth.forgot.newPassword")}
              autoComplete="new-password"
              rules
            />
          )}
        </form.AppField>
        <form.AppField name="confirmPassword">
          {(field) => (
            <field.PasswordField
              label={t("auth.forgot.confirmNewPassword")}
              autoComplete="new-password"
            />
          )}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton
            isPending={isPending}
            size="lg"
            className="w-full"
            pendingLabel={t("auth.forgot.saving")}
          >
            {t("auth.forgot.change")}
          </form.SubmitButton>
        </form.AppForm>
        <button
          type="button"
          onClick={onBack}
          className="font-medium text-primary hover:underline"
        >
          {t("auth.forgot.differentEmail")}
        </button>
      </FieldGroup>
    </form>
  );
}
