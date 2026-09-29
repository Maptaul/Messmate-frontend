"use client";

import { KeyRoundIcon } from "lucide-react";
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

/** Step 1 asks for the email; step 2 takes the emailed code and a new password. */
export default function ForgotPasswordForm() {
  const t = useT();
  const href = useLocalePath();
  const [email, setEmail] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <KeyRoundIcon className="size-6" aria-hidden />
        </span>
        <h1 className="text-2xl font-semibold tracking-tight">
          {email ? t("auth.forgot.resetTitle") : t("auth.forgot.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
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

      <p className="text-center text-sm text-muted-foreground">
        {t("auth.forgot.remembered")}{" "}
        <Link
          href={href("/login")}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {t("auth.forgot.backToLogin")}
        </Link>
      </p>
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
              description={t("auth.register.passwordHint")}
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
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {t("auth.forgot.differentEmail")}
        </button>
      </FieldGroup>
    </form>
  );
}
