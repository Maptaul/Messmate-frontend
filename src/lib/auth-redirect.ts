import { decodeJwt } from "jose";
import type { Role } from "@/types";
import { ROLE_HOME } from "./constants";

/** Only ever follow a path on this site — never `//evil.com` or a full URL. */
export function safeRedirect(value: string | null | undefined): string | null {
  if (!value?.startsWith("/") || value.startsWith("//")) return null;
  return value;
}

/**
 * Where to go after signing in. The token is decoded, not verified: the proxy
 * verifies it on the very next navigation, and this only picks a URL.
 */
export function homeAfterLogin(accessToken: string, redirect?: string | null) {
  const { role } = decodeJwt(accessToken) as { role?: Role };
  return safeRedirect(redirect) ?? (role ? ROLE_HOME[role] : "/");
}
