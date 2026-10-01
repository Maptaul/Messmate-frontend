"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Locale } from "@/i18n/config";
import GoogleAuthProvider from "./google-auth.provider";
import QueryProvider from "./query.provider";

export default function Providers({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <GoogleAuthProvider locale={locale}>
        <QueryProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </QueryProvider>
      </GoogleAuthProvider>
    </ThemeProvider>
  );
}
