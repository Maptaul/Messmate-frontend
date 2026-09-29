import type { ReactNode } from "react";
import Footer from "@/components/layout/public/Footer";
import Header from "@/components/layout/public/Header";
import { getLocale } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";
import { getSessionUser } from "@/lib/session";
import { ROLE_HOME } from "@/utils";

export default async function layout({ children }: { children: ReactNode }) {
  const [locale, user] = await Promise.all([getLocale(), getSessionUser()]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        dashboardHref={user ? localePath(locale, ROLE_HOME[user.role]) : null}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
