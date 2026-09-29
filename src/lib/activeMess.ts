import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { getMe } from "@/api";
import type { ApiResponse, Me, UserRole } from "@/types";
import { ACTIVE_MESS_COOKIE } from "@/utils/mess.util";
import serverApi from "./serverApi";
import { getSessionUser } from "./session";

export interface MessChoice {
  id: string;
  name: string;
  address: string;
}

/** /auth/me once per request, shared by the layout and the page. */
export const getMeOnServer = cache(
  async (): Promise<ApiResponse<Me> | null> => {
    try {
      return await getMe(await serverApi());
    } catch {
      return null;
    }
  },
);

/** A manager works in the messes they own; a member in the ones they live in. */
export function messChoicesFor(me: Me | null, role: UserRole): MessChoice[] {
  if (!me) return [];
  if (role === "MESS_MANAGER") {
    return me.managedMesses.map(({ id, name, address }) => ({
      id,
      name,
      address,
    }));
  }
  if (role === "MEMBER") {
    return me.memberships
      .filter((membership) => membership.status === "ACTIVE")
      .map(({ mess }) => mess);
  }
  return [];
}

/**
 * The mess the dashboard is showing: the one picked in the switcher if it's
 * still theirs, otherwise the first. The cookie is only a preference — it is
 * checked against the user's own messes every time.
 */
export const getActiveMess = cache(async () => {
  const user = await getSessionUser();
  if (!user) return { choices: [], activeMessId: null };

  const choices = messChoicesFor(
    (await getMeOnServer())?.data ?? null,
    user.role,
  );
  const saved = (await cookies()).get(ACTIVE_MESS_COOKIE)?.value;
  const active = choices.find((choice) => choice.id === saved) ?? choices[0];

  return { choices, activeMessId: active?.id ?? null };
});
