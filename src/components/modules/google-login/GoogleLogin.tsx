"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FieldSeparator } from "@/components/ui/field";
import { useGoogleOAuth } from "@/hooks";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { getErrorMessage, homeAfterLogin, nameFromToken } from "@/utils";

/** Google's own button; hidden when NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set. */
export default function GoogleLoginComponent({
  redirect,
}: {
  redirect?: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useT();
  const locale = useLocale();
  const { mutate: googleLogin } = useGoogleOAuth();

  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return null;

  return (
    <>
      <FieldSeparator>{t("auth.login.orGoogle")}</FieldSeparator>
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={({ credential }) => {
            if (!credential) {
              toast.error(t("toast.googleFailed"));
              return;
            }
            googleLogin(
              { idToken: credential },
              {
                onSuccess: ({ data }) => {
                  toast.success(
                    t("toast.loggedIn", {
                      name: nameFromToken(data.accessToken),
                    }),
                  );
                  queryClient.removeQueries({ queryKey: ["user"] });
                  router.replace(
                    homeAfterLogin(data.accessToken, locale, redirect),
                  );
                },
                onError: (err) => toast.error(t.dynamic(getErrorMessage(err))),
              },
            );
          }}
          onError={() => toast.error(t("toast.googleFailed"))}
        />
      </div>
    </>
  );
}
