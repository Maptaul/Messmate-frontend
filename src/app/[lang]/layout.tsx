import type { Metadata } from "next";
import { Anek_Bangla, Roboto } from "next/font/google";
import { LOCALES } from "@/i18n/config";
import { getDictionary, getLocale, getT } from "@/i18n/get-dictionary";
import { I18nProvider } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";
import Providers from "@/providers";
import "../globals.css";

// English in Roboto; any Bengali glyph falls through to Anek Bangla (see --font-sans).
const roboto = Roboto({ subsets: ["latin"], variable: "--font-roboto" });
const anekBangla = Anek_Bangla({
  subsets: ["bengali", "latin"],
  variable: "--font-anek-bangla",
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const [t, locale] = await Promise.all([getT(), getLocale()]);

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    ),
    title: { default: t("meta.siteTitle"), template: "%s · MessMate" },
    description: t("meta.siteDescription"),
    applicationName: "MessMate",
    openGraph: {
      type: "website",
      siteName: "MessMate",
      locale: locale === "bn" ? "bn_BD" : "en_BD",
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const [locale, dictionary] = await Promise.all([
    getLocale(),
    getDictionary(),
  ]);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(
        "font-sans antialiased",
        roboto.variable,
        anekBangla.variable,
      )}
    >
      <body>
        <Providers>
          <I18nProvider locale={locale} dictionary={dictionary}>
            {children}
          </I18nProvider>
        </Providers>
      </body>
    </html>
  );
}
