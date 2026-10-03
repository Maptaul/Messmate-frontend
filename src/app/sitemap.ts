import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n/config";
import { localePath } from "@/i18n/locale-path";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const PUBLIC_PAGES = [
  "/",
  "/features",
  "/about-us",
  "/faq",
  "/contact",
  "/login",
  "/register",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PAGES.map((path) => ({
    url: `${APP_URL}${localePath("en", path)}`,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((locale) => [
          locale,
          `${APP_URL}${localePath(locale, path)}`,
        ]),
      ),
    },
  }));
}
