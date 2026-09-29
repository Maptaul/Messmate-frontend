"use client";

import { createContext, type ReactNode, useContext } from "react";

export interface MessChoiceView {
  id: string;
  name: string;
  address: string;
}

interface ActiveMess {
  /** null: a manager with no mess yet, a member not in one, or an admin. */
  messId: string | null;
  messes: MessChoiceView[];
}

const ActiveMessContext = createContext<ActiveMess>({
  messId: null,
  messes: [],
});

export function ActiveMessProvider({
  value,
  children,
}: {
  value: ActiveMess;
  children: ReactNode;
}) {
  return <ActiveMessContext value={value}>{children}</ActiveMessContext>;
}

export const useActiveMess = () => useContext(ActiveMessContext);
