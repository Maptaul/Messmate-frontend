"use client";

import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { initialsOf } from "@/components/ui/user-avatar";
import { useLocalePath, useT } from "@/i18n/i18n-provider";
import type { MessChoice } from "@/lib/activeMess";
import type { UserRole } from "@/types";
import { rememberActiveMess } from "@/utils";

/** Which mess the dashboard shows. Hidden for admins and single-mess members. */
export default function MessSwitcher({
  role,
  messes,
  activeMessId,
}: {
  role: UserRole;
  messes: MessChoice[];
  activeMessId: string | null;
}) {
  const t = useT();
  const href = useLocalePath();
  const router = useRouter();

  const isManager = role === "MESS_MANAGER";
  if (role === "ADMIN" || (!isManager && messes.length < 2)) return null;

  const active = messes.find((mess) => mess.id === activeMessId);

  const handleChoose = (messId: string) => {
    rememberActiveMess(messId);
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("messSwitcher.label")}
        className="flex w-full items-center gap-2.5 rounded-md border bg-card px-2.5 py-2 text-left shadow-1 outline-none transition-colors hover:border-border-strong focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary-tint text-xs font-semibold text-primary">
          {initialsOf(active?.name ?? "MM")}
        </span>
        <span className="grid min-w-0 flex-1 leading-tight">
          <span className="truncate text-[13px] font-medium">
            {active?.name ?? t("messSwitcher.noMess")}
          </span>
          {active && (
            <span className="truncate text-[11px] text-muted-foreground">
              {active.address}
            </span>
          )}
        </span>
        <ChevronsUpDownIcon className="size-3.5 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-(--anchor-width)">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="micro text-[10px]">
            {t("shell.messesLabel")}
          </DropdownMenuLabel>
          {messes.map((mess) => (
            <DropdownMenuItem
              key={mess.id}
              onClick={() => mess.id !== activeMessId && handleChoose(mess.id)}
              className="items-start"
            >
              <span className="grid flex-1 leading-tight">
                <span className="truncate text-[13px] font-medium">
                  {mess.name}
                </span>
                <span className="truncate text-[11px] text-muted-foreground">
                  {mess.address}
                </span>
              </span>
              {mess.id === activeMessId && (
                <CheckIcon className="mt-0.5 ml-auto text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        {isManager && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              render={<Link href={href("/manager/messes/new")} />}
              className="font-medium"
            >
              <PlusIcon />
              {t("messSwitcher.create")}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
