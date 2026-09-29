"use client";

import { createContext, type ReactNode, useContext } from "react";
import type { SessionUser } from "@/types";

const SessionContext = createContext<SessionUser | null>(null);

/** The signed-in user, read once on the server and shared with client UI. */
export function SessionProvider({
  user,
  children,
}: {
  user: SessionUser;
  children: ReactNode;
}) {
  return <SessionContext value={user}>{children}</SessionContext>;
}

export function useSession(): SessionUser {
  const user = useContext(SessionContext);
  if (!user) throw new Error("useSession must be used inside SessionProvider");
  return user;
}
