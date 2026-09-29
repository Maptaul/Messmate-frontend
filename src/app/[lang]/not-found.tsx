import { CompassIcon } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";
import { ROLE_HOME } from "@/lib/constants";
import { getSessionUser } from "@/lib/session";

export default async function NotFound() {
  const [t, locale, user] = await Promise.all([
    getT(),
    getLocale(),
    getSessionUser(),
  ]);

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 p-6 text-center">
      <Logo href={localePath(locale, "/")} />
      <div className="space-y-3">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <CompassIcon className="size-7" aria-hidden />
        </span>
        <p className="text-7xl font-bold tracking-tight text-primary">404</p>
        <h1 className="text-2xl font-semibold">{t("notFound.title")}</h1>
        <p className="text-muted-foreground">{t("notFound.body")}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          render={<Link href={localePath(locale, "/")} />}
          nativeButton={false}
        >
          {t("notFound.home")}
        </Button>
        {user && (
          <Button
            variant="outline"
            render={<Link href={localePath(locale, ROLE_HOME[user.role])} />}
            nativeButton={false}
          >
            {t("notFound.dashboard")}
          </Button>
        )}
      </div>
    </main>
  );
}
