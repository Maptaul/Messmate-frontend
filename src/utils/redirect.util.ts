import { decodeJwt } from "jose";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/locale-path";
import type { UserRole } from "@/types";
import { ROLE_HOME } from "./role.util";

/** Only ever follow a path on this site - never `//evil.com` or a full URL. */
export function safeRedirect(value: string | null | undefined): string | null {
  if (!value?.startsWith("/") || value.startsWith("//")) return null;
  return value;
}

/**
 * Where to go after signing in. The token is decoded, not verified: the proxy
 * verifies it on the very next navigation, and this only picks a URL.
 */
export function homeAfterLogin(
  accessToken: string,
  locale: Locale,
  redirect?: string | null,
) {
  const { role } = decodeJwt(accessToken) as { role?: UserRole };
  // A redirect already carries its locale prefix (the proxy set it).
  return (
    safeRedirect(redirect) ?? localePath(locale, role ? ROLE_HOME[role] : "/")
  );
}

export function nameFromToken(accessToken: string) {
  const { name } = decodeJwt(accessToken) as { name?: string };
  return name ?? "";
}
