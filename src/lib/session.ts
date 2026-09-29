import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import type { SessionUser } from "@/types";
import { ACCESS_COOKIE } from "./constants";
import { verifyAccessToken } from "./jwt";

/** The signed-in user for this request, read from the access-token cookie. */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const cookieStore = await cookies();
  return verifyAccessToken(cookieStore.get(ACCESS_COOKIE)?.value);
});
