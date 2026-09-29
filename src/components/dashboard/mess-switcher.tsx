"use client";

import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
        render={
          <Button
            variant="ghost"
            className="max-w-56"
            aria-label={t("messSwitcher.label")}
          />
        }
      >
        <span className="truncate">
          {active?.name ?? t("messSwitcher.noMess")}
        </span>
        <ChevronsUpDownIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("messSwitcher.label")}</DropdownMenuLabel>
          {messes.map((mess) => (
            <DropdownMenuItem
              key={mess.id}
              onClick={() => mess.id !== activeMessId && handleChoose(mess.id)}
            >
              <span className="grid flex-1 leading-tight">
                <span className="truncate">{mess.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {mess.address}
                </span>
              </span>
              {mess.id === activeMessId && <CheckIcon className="ml-auto" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        {isManager && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              render={<Link href={href("/manager/messes/new")} />}
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
