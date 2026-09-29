import type { Metadata } from "next";
import { Anek_Bangla, Roboto } from "next/font/google";
import { cn } from "@/lib/utils";
import Providers from "@/providers";
import "./globals.css";

// English in Roboto; any Bengali glyph falls through to Anek Bangla (see --font-sans).
const roboto = Roboto({ subsets: ["latin"], variable: "--font-roboto" });
const anekBangla = Anek_Bangla({
  subsets: ["bengali", "latin"],
  variable: "--font-anek-bangla",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "MessMate — shared mess accounts, settled",
    template: "%s · MessMate",
  },
  description:
    "Meal plans, groceries, deposits and the month-end bill for shared messes in Bangladesh — every member sees the same ledger.",
  applicationName: "MessMate",
  openGraph: {
    type: "website",
    siteName: "MessMate",
    locale: "en_BD",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "font-sans antialiased",
        roboto.variable,
        anekBangla.variable,
      )}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
