"use client";

import {
  CircleEllipsisIcon,
  DropletIcon,
  FlameIcon,
  HandHelpingIcon,
  HouseIcon,
  type LucideIcon,
  ShoppingBasketIcon,
  WifiIcon,
  ZapIcon,
} from "lucide-react";
import { useT } from "@/i18n/i18n-provider";
import type { ExpenseType as Type } from "@/types";

export const EXPENSE_TYPE_ICON: Record<Type, LucideIcon> = {
  GROCERY: ShoppingBasketIcon,
  GAS: FlameIcon,
  ELECTRICITY: ZapIcon,
  WATER: DropletIcon,
  INTERNET: WifiIcon,
  MAID: HandHelpingIcon,
  RENT: HouseIcon,
  OTHER: CircleEllipsisIcon,
};

/** The type's icon and name, as the expense tables show it. */
export default function ExpenseType({ type }: { type: Type }) {
  const t = useT();
  const Icon = EXPENSE_TYPE_ICON[type];

  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <Icon className="size-4 text-muted-foreground" />
      {t(`expenseTypes.${type}`)}
    </span>
  );
}
