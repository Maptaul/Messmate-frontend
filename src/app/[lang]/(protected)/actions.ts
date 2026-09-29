"use server";

import { cookies } from "next/headers";
import { ACTIVE_MESS_COOKIE, getActiveMess } from "@/lib/active-mess";

/** Remembers which mess the dashboard shows. Only the user's own messes stick. */
export async function setActiveMess(messId: string) {
  const { choices } = await getActiveMess();
  if (!choices.some((choice) => choice.id === messId)) return;

  (await cookies()).set(ACTIVE_MESS_COOKIE, messId, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
}
