"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";

export default function GoogleAuthProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId} locale={locale}>
      {children}
    </GoogleOAuthProvider>
  );
}
