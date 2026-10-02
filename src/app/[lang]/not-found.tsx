import Link from "next/link";
import Logo from "@/assets/svg/Logo";
import { Button } from "@/components/ui/button";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";
import { getSessionUser } from "@/lib/session";
import { ROLE_HOME } from "@/utils";

export default async function NotFound() {
  const [t, locale, user] = await Promise.all([
    getT(),
    getLocale(),
    getSessionUser(),
  ]);

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 bg-background p-6 text-center">
      {/* not-found cannot export metadata; React's <title> is the documented way. */}
      <title>{`${t("notFound.metaTitle")} · MessMate`}</title>
      <Link
        href={localePath(locale, "/")}
        className="flex items-center gap-2 font-semibold"
      >
        <Logo />
        <span className="text-lg">MessMate</span>
      </Link>
      <div className="flex w-full max-w-md flex-col items-center gap-3 rounded-2xl border bg-card p-8 shadow-2">
        <p className="font-mono text-6xl font-semibold tracking-tight text-muted-foreground">
          404
        </p>
        <h1 className="text-xl font-semibold">{t("notFound.title")}</h1>
        <p className="text-muted-foreground">{t("notFound.body")}</p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
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
      </div>
    </main>
  );
}
