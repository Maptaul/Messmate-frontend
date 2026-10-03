"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  LockIcon,
  LogInIcon,
  ShieldCheckIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import type { AuthTokens, LoginPayload, UserRole } from "@/types";
import {
  getErrorMessage,
  homeAfterLogin,
  nameFromToken,
  ROLE_LABEL_KEY,
} from "@/utils";
import { loginSchema } from "@/validation";
import { applyServerErrors, useAppForm } from ".";

// Seeded demo accounts for one-click login. Public on purpose: they hold no
// real data.
const DEMO_ACCOUNTS: {
  role: UserRole;
  email: string;
  password: string;
  blurbKey: MessageKey;
  icon: typeof UserIcon;
  tile: string;
}[] = [
  {
    role: "ADMIN",
    email: "admin@messmate.app",
    password: "Admin@messmate12345",
    blurbKey: "auth.login.demoAdmin",
    icon: ShieldCheckIcon,
    tile: "bg-foreground text-background",
  },
  {
    role: "MESS_MANAGER",
    email: "manager@messmate.app",
    password: "Manager@messmate12345",
    blurbKey: "auth.login.demoManager",
    icon: UsersIcon,
    tile: "tone-b",
  },
  {
    role: "MEMBER",
    email: "member@messmate.app",
    password: "Member@messmate12345",
    blurbKey: "auth.login.demoMember",
    icon: UserIcon,
    tile: "tone-g",
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
    toast.success(
      t("toast.loggedIn", { name: nameFromToken(tokens.accessToken) }),
    );
    queryClient.removeQueries({ queryKey: ["user"] });
    router.replace(homeAfterLogin(tokens.accessToken, locale, redirect));
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
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-[28px] leading-tight font-semibold tracking-tight">
          {t("auth.login.title")}
        </h1>
        <p className="mt-1 text-foreground-2">{t("auth.login.subtitle")}</p>
      </div>
      {redirect && (
        <output className="tone-b flex items-center gap-2 rounded-lg border px-3 py-2.5 text-[13.5px]">
          <LockIcon className="size-4 shrink-0" />
          {t("auth.login.redirectNote")}
        </output>
      )}

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup className="gap-4">
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
              <field.PasswordField
                label={t("auth.login.password")}
                action={
                  <Link
                    href={href("/forgot-password")}
                    className="text-[13px] font-medium text-primary hover:underline"
                  >
                    {t("auth.login.forgot")}
                  </Link>
                }
              />
            )}
          </form.AppField>
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

      <section
        aria-label={t("auth.login.demoTitle")}
        className="grid grid-cols-3 gap-2"
      >
        {DEMO_ACCOUNTS.map((demo) => (
          <Button
            key={demo.role}
            variant="outline"
            className={cn(
              "h-auto min-h-10 justify-start gap-2 px-2.5 py-1.5 whitespace-normal",
              demoRole === demo.role && "border-ring",
            )}
            disabled={loginPending}
            onClick={() => demoLogin(demo)}
            title={t(demo.blurbKey)}
            aria-label={t("auth.login.demoAria", {
              role: t(ROLE_LABEL_KEY[demo.role]),
            })}
          >
            <span
              className={cn(
                "grid size-6 shrink-0 place-items-center rounded-md",
                demo.tile,
              )}
            >
              {demoRole === demo.role ? (
                <Spinner />
              ) : (
                <demo.icon className="size-3.5" aria-hidden />
              )}
            </span>
            <span className="text-left text-[13px] leading-tight font-medium">
              {t(ROLE_LABEL_KEY[demo.role])}
            </span>
          </Button>
        ))}
      </section>

      <div className="text-center text-foreground-2">
        {t("auth.login.newHere")}{" "}
        <Link
          href={href("/register")}
          className="font-medium text-primary hover:underline"
        >
          {t("auth.login.createAccount")}
        </Link>
      </div>
    </div>
  );
}
