"use client";

import { LogInIcon, ShieldCheckIcon, UserIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { applyServerErrors, useAppForm } from "@/components/form";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldSeparator } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useLogin } from "@/hooks";
import { useLocale, useLocalePath, useT } from "@/i18n/i18n-provider";
import { homeAfterLogin } from "@/lib/auth-redirect";
import { DEMO_ACCOUNTS, ROLE_LABEL_KEY } from "@/lib/constants";
import { getErrorMessage } from "@/lib/errors";
import type { LoginPayload, Role } from "@/types";
import { loginSchema } from "@/validation";
import { FormAlert } from "./form-alert";

const DEMO_ICON: Record<Role, typeof UserIcon> = {
  ADMIN: ShieldCheckIcon,
  MESS_MANAGER: UsersIcon,
  MEMBER: UserIcon,
};

export function LoginForm({
  redirect,
  initialEmail = "",
}: {
  redirect?: string;
  initialEmail?: string;
}) {
  const router = useRouter();
  const t = useT();
  const locale = useLocale();
  const href = useLocalePath();
  const { mutateAsync: signIn } = useLogin();
  const [formError, setFormError] = useState<string | null>(null);
  const [demoRole, setDemoRole] = useState<Role | null>(null);

  const enter = async (payload: LoginPayload) => {
    setFormError(null);
    const { data } = await signIn(payload);
    router.replace(homeAfterLogin(data.accessToken, locale, redirect));
    router.refresh();
  };

  const form = useAppForm({
    defaultValues: { email: initialEmail, password: "" },
    validators: { onChange: loginSchema },
    onSubmit: async ({ value }) => {
      try {
        await enter(value);
      } catch (error) {
        setFormError(getErrorMessage(error));
        applyServerErrors(form, error);
      }
    },
  });

  const demoLogin = async (role: Role) => {
    const account = DEMO_ACCOUNTS.find((demo) => demo.role === role);
    if (!account) return;

    setDemoRole(role);
    try {
      await enter({ email: account.email, password: account.password });
    } catch (error) {
      setFormError(getErrorMessage(error));
      setDemoRole(null);
    }
  };

  const busy = demoRole !== null;

  return (
    <div className="space-y-8">
      <div className="space-y-1.5 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("auth.login.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("auth.login.subtitle")}
        </p>
      </div>

      <FormAlert message={formError} />

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
                label={t("auth.login.email")}
                type="email"
                autoComplete="email"
                placeholder={t("auth.login.emailPlaceholder")}
              />
            )}
          </form.AppField>
          <form.AppField name="password">
            {(field) => (
              <field.PasswordField label={t("auth.login.password")} />
            )}
          </form.AppField>
          <div className="-mt-3 text-right">
            <Link
              href={href("/forgot-password")}
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {t("auth.login.forgot")}
            </Link>
          </div>
          <form.AppForm>
            <form.SubmitButton
              size="lg"
              className="w-full"
              pendingLabel={t("auth.login.submitting")}
            >
              <LogInIcon />
              {t("auth.login.submit")}
            </form.SubmitButton>
          </form.AppForm>
        </FieldGroup>
      </form>

      <FieldSeparator>{t("auth.login.orDemo")}</FieldSeparator>

      <section aria-labelledby="demo-login" className="space-y-3">
        <h2 id="demo-login" className="text-center text-sm font-medium">
          {t("auth.login.demoTitle")}
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {DEMO_ACCOUNTS.map(({ role, blurbKey }) => {
            const Icon = DEMO_ICON[role];
            return (
              <div
                key={role}
                className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 text-center"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <p className="text-sm font-medium">{t(ROLE_LABEL_KEY[role])}</p>
                <p className="text-xs text-muted-foreground">{t(blurbKey)}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-auto w-full"
                  disabled={busy}
                  onClick={() => demoLogin(role)}
                  aria-label={t("auth.login.demoAria", {
                    role: t(ROLE_LABEL_KEY[role]),
                  })}
                >
                  {demoRole === role ? <Spinner /> : null}
                  {t("auth.login.demoButton")}
                </Button>
              </div>
            );
          })}
        </div>
      </section>

      <p className="text-center text-sm text-muted-foreground">
        {t("auth.login.newHere")}{" "}
        <Link
          href={href("/register")}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {t("auth.login.createAccount")}
        </Link>
      </p>
    </div>
  );
}
