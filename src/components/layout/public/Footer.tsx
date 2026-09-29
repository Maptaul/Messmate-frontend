import Link from "next/link";
import Logo from "@/assets/svg/Logo";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";

export default async function Footer() {
  const [t, locale] = await Promise.all([getT(), getLocale()]);
  const href = (path: string) => localePath(locale, path);

  const columns = [
    {
      title: t("marketing.footer.product"),
      links: [
        [t("marketing.nav.features"), "/features"],
        [t("marketing.nav.faq"), "/faq"],
      ],
    },
    {
      title: t("marketing.footer.company"),
      links: [
        [t("marketing.nav.about"), "/about-us"],
        [t("marketing.nav.contact"), "/contact"],
      ],
    },
    {
      title: t("marketing.footer.account"),
      links: [
        [t("marketing.nav.login"), "/login"],
        [t("marketing.nav.register"), "/register"],
      ],
    },
  ] as const;

  return (
    <footer className="border-t">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        <div className="space-y-3">
          <Link
            href={href("/")}
            className="flex items-center gap-2 font-semibold"
          >
            <Logo />
            <span className="text-lg tracking-tight">MessMate</span>
          </Link>
          <p className="max-w-xs text-sm text-muted-foreground">
            {t("marketing.footer.tagline")}
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.title} className="space-y-3">
            <p className="text-sm font-medium">{column.title}</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {column.links.map(([label, path]) => (
                <li key={path}>
                  <Link href={href(path)} className="hover:text-foreground">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-muted-foreground sm:px-6">
          {t("marketing.footer.rights", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
