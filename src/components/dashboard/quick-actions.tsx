"use client";

import {
  CalendarDaysIcon,
  CreditCardIcon,
  HandCoinsIcon,
  type LucideIcon,
  PlusIcon,
  ShoppingBasketIcon,
  ShoppingCartIcon,
  UtensilsIcon,
  WalletIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocalePath, useT } from "@/i18n/i18n-provider";
import type { MessageKey } from "@/i18n/translate";
import type { UserRole } from "@/types";

interface QuickAction {
  label: MessageKey;
  hint: MessageKey;
  icon: LucideIcon;
  /** `?new=1` opens the page's create form on arrival. */
  url: string;
}

const PLAN: QuickAction = {
  label: "shell.quick.plan",
  hint: "shell.quick.planHint",
  icon: CalendarDaysIcon,
  url: "/dashboard",
};

const ACTIONS: Partial<Record<UserRole, QuickAction[]>> = {
  MESS_MANAGER: [
    {
      label: "shell.quick.expense",
      hint: "shell.quick.expenseHint",
      icon: ShoppingBasketIcon,
      url: "/manager/expenses?new=1",
    },
    {
      label: "shell.quick.meals",
      hint: "shell.quick.mealsHint",
      icon: UtensilsIcon,
      url: "/manager/meals",
    },
    {
      label: "shell.quick.deposit",
      hint: "shell.quick.depositHint",
      icon: HandCoinsIcon,
      url: "/manager/deposits?new=1",
    },
    {
      label: "shell.quick.duty",
      hint: "shell.quick.dutyHint",
      icon: ShoppingCartIcon,
      url: "/manager/grocery-duty?new=1",
    },
    PLAN,
  ],
  MEMBER: [
    PLAN,
    {
      label: "shell.quick.pay",
      hint: "shell.quick.payHint",
      icon: CreditCardIcon,
      url: "/dashboard/bills",
    },
    {
      label: "shell.quick.finance",
      hint: "shell.quick.financeHint",
      icon: WalletIcon,
      url: "/finance?new=1",
    },
  ],
};

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

/** "New" (N): the common jobs, one tap from any page. */
export default function QuickActions({ role }: { role: UserRole }) {
  const t = useT();
  const href = useLocalePath();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const actions = ACTIONS[role] ?? [];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key.toLowerCase() !== "n" || isTyping(event.target)) return;
      event.preventDefault();
      setOpen((value) => !value);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (actions.length === 0) return null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <Button
            className="shrink-0 gap-1.5 pr-2.5 pl-2"
            aria-label={t("shell.quickTitle")}
            title={`${t("shell.quickTitle")} (N)`}
          />
        }
      >
        <PlusIcon />
        <span className="hidden md:inline">{t("shell.quickNew")}</span>
        <kbd className="hidden rounded bg-white/20 px-1.5 font-mono text-[10px] leading-4 md:inline">
          N
        </kbd>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-70 p-1.5">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2.5 pt-1.5 pb-1 text-xs font-medium">
            {t("shell.quickTitle")}
          </DropdownMenuLabel>
          {actions.map((action) => (
            <DropdownMenuItem
              key={action.url}
              onClick={() => router.push(href(action.url))}
              className="gap-2.5 px-2.5 py-2"
            >
              <span className="grid size-7.5 shrink-0 place-items-center rounded-md border bg-muted text-foreground-2">
                <action.icon className="size-3.75" />
              </span>
              <span className="grid min-w-0 leading-tight">
                <span className="text-[13.5px] font-medium">
                  {t(action.label)}
                </span>
                <span className="text-[11.5px] text-muted-foreground">
                  {t(action.hint)}
                </span>
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
