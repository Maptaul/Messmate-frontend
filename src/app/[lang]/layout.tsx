import {
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
} from "lucide-react";
import type { Metadata } from "next";
import { Anek_Bangla, Roboto, Roboto_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
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
// Ids, invoice numbers and transaction references.
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
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
        robotoMono.variable,
      )}
    >
      <body>
        <Providers locale={locale}>
          <I18nProvider locale={locale} dictionary={dictionary}>
            {children}
            <Toaster
              closeButton
              position="top-right"
              icons={{
                success: <CircleCheckIcon className="size-4 text-primary" />,
                info: <InfoIcon className="size-4 text-muted-foreground" />,
                warning: (
                  <CircleAlertIcon className="size-4 text-destructive" />
                ),
                error: <CircleAlertIcon className="size-4 text-destructive" />,
                loading: <Loader2Icon className="size-4 animate-spin" />,
              }}
              toastOptions={{ classNames: { toast: "cn-toast shadow-3!" } }}
            />
          </I18nProvider>
        </Providers>
      </body>
    </html>
  );
}
