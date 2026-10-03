import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n/config";
import { localePath } from "@/i18n/locale-path";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// Signed-in areas: a crawler only ever sees the login page there.
const PRIVATE = ["/admin", "/manager", "/dashboard", "/profile", "/finance"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        ...LOCALES.flatMap((locale) =>
          PRIVATE.map((path) => localePath(locale, path)),
        ),
      ],
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
