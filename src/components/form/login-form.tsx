"use client";

import { useQueryClient } from "@tanstack/react-query";
import { LogInIcon, ShieldCheckIcon, UserIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import GoogleLoginComponent from "@/components/modules/google-login/GoogleLogin";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldSeparator } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useLogin } from "@/hooks";
import { useLocale, useLocalePath, useT } from "@/i18n/i18n-provider";
import type { MessageKey } from "@/i18n/translate";
import type { AuthTokens, LoginPayload, UserRole } from "@/types";
import {
  getErrorMessage,
  homeAfterLogin,
  ROLE_LABEL_KEY,
} from "@/utils";
import { loginSchema } from "@/validation";
import { applyServerErrors, useAppForm } from ".";

// Seeded demo accounts for evaluators. Public on purpose: B7A7 asks for
// one-click demo login, and these hold no real data.
const DEMO_ACCOUNTS: {
  role: UserRole;
  email: string;
  password: string;
  blurbKey: MessageKey;
  icon: typeof UserIcon;
}[] = [
  {
    role: "ADMIN",
    email: "admin@messmate.app",
    password: "Admin@messmate12345",
    blurbKey: "auth.login.demoAdmin",
    icon: ShieldCheckIcon,
  },
  {
    role: "MESS_MANAGER",
    email: "manager@messmate.app",
    password: "Manager@messmate12345",
    blurbKey: "auth.login.demoManager",
    icon: UsersIcon,
  },
  {
    role: "MEMBER",
    email: "member@messmate.app",
    password: "Member@messmate12345",
    blurbKey: "auth.login.demoMember",
    icon: UserIcon,
  },
];

export default function LoginForm({
  redirect,
  initialEmail = "",
}: {
  redirect?: string;
  initialEmail?: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useT();
  const locale = useLocale();
  const href = useLocalePath();
  const [demoRole, setDemoRole] = useState<UserRole | null>(null);

  const { mutate: login, isPending: loginPending } = useLogin();

  const onLoggedIn = (tokens: AuthTokens) => {
    toast.success(t("toast.loggedIn", { name: tokens.user.name }));
    queryClient.removeQueries({ queryKey: ["user"] });
    router.replace(homeAfterLogin(tokens.accessToken, locale, redirect));
    router.refresh();
  };

  const form = useAppForm({
    defaultValues: { email: initialEmail, password: "" },
    validators: { onChange: loginSchema },
    onSubmit: ({ value }) => {
      login(value, {
        onSuccess: (res) => onLoggedIn(res.data),
        onError: (err) => {
          toast.error(t.dynamic(getErrorMessage(err)));
          applyServerErrors(form, err);
        },
      });
    },
  });

  const demoLogin = (demo: LoginPayload & { role: UserRole }) => {
    setDemoRole(demo.role);
    login(
      { email: demo.email, password: demo.password },
      {
        onSuccess: (res) => onLoggedIn(res.data),
        onError: (err) => {
          toast.error(t.dynamic(getErrorMessage(err)));
          setDemoRole(null);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          {t("auth.login.title")}
        </h1>
        <p className="text-balance text-sm text-muted-foreground">
          {t("auth.login.subtitle")}
        </p>
      </div>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
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
              isPending={loginPending && !demoRole}
              pendingLabel={t("auth.login.submitting")}
            >
              <LogInIcon />
              {t("auth.login.submit")}
            </form.SubmitButton>
          </form.AppForm>
        </FieldGroup>
      </form>

      <GoogleLoginComponent redirect={redirect} />

      <FieldSeparator>{t("auth.login.orDemo")}</FieldSeparator>

      <section aria-labelledby="demo-login" className="space-y-3">
        <h2 id="demo-login" className="text-center text-sm font-medium">
          {t("auth.login.demoTitle")}
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {DEMO_ACCOUNTS.map((demo) => (
            <div
              key={demo.role}
              className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 text-center"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <demo.icon className="size-5" aria-hidden />
              </span>
              <p className="text-sm font-medium">
                {t(ROLE_LABEL_KEY[demo.role])}
              </p>
              <p className="text-xs text-muted-foreground">
                {t(demo.blurbKey)}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-auto w-full"
                disabled={loginPending}
                onClick={() => demoLogin(demo)}
                aria-label={t("auth.login.demoAria", {
                  role: t(ROLE_LABEL_KEY[demo.role]),
                })}
              >
                {demoRole === demo.role && <Spinner />}
                {t("auth.login.demoButton")}
              </Button>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center text-sm text-muted-foreground">
        {t("auth.login.newHere")}{" "}
        <Link
          href={href("/register")}
          className="font-medium underline underline-offset-4 hover:text-primary"
        >
          {t("auth.login.createAccount")}
        </Link>
      </div>
    </div>
  );
}
