import { jwtVerify } from "jose";
import type { SessionUser, UserRole } from "@/types";

export const ACCESS_COOKIE = "accessToken";
export const REFRESH_COOKIE = "refreshToken";

const ROLES: readonly UserRole[] = ["ADMIN", "MESS_MANAGER", "MEMBER"];

const secretValue = process.env.JWT_ACCESS_SECRET;

if (!secretValue) {
  throw new Error(
    "JWT_ACCESS_SECRET is not set. It must equal the backend's access secret.",
  );
}

const secret = new TextEncoder().encode(secretValue);

/**
 * Verifies the backend's access token and returns who it belongs to, or null.
 * This decides navigation only - the API re-checks role and ban status on
 * every request, so a stale role here can show a page but never its data.
 */
export async function verifyAccessToken(
  token: string | undefined,
): Promise<SessionUser | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    const { userId, name, email, role } = payload;

    if (
      typeof userId !== "string" ||
      typeof name !== "string" ||
      typeof email !== "string" ||
      !ROLES.includes(role as UserRole)
    ) {
      return null;
    }

    return { userId, name, email, role: role as UserRole };
  } catch {
    return null;
  }
}
