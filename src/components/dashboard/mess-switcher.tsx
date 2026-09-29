"use client";

import {
  Building2Icon,
  CheckIcon,
  ChevronsUpDownIcon,
  PlusIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setActiveMess } from "@/app/[lang]/(protected)/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { useLocalePath, useT } from "@/i18n/i18n-provider";
import { useActiveMess } from "@/providers/active-mess-provider";
import { useSession } from "@/providers/session-provider";

/** Which mess the dashboard shows. Hidden for admins and single-mess members. */
export function MessSwitcher() {
  const { role } = useSession();
  const { messId, messes } = useActiveMess();
  const t = useT();
  const href = useLocalePath();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const isManager = role === "MESS_MANAGER";
  if (role === "ADMIN" || (!isManager && messes.length < 2)) return null;

  const active = messes.find((mess) => mess.id === messId);

  const choose = (id: string) =>
    startTransition(async () => {
      await setActiveMess(id);
      router.refresh();
    });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <SidebarMenuButton
            size="lg"
            aria-label={t("messSwitcher.label")}
            className="data-popup-open:bg-sidebar-accent"
          />
        }
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          {pending ? <Spinner /> : <Building2Icon className="size-4" />}
        </span>
        <span className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">
            {active?.name ?? t("messSwitcher.noMess")}
          </span>
          {active && (
            <span className="truncate text-xs text-muted-foreground">
              {active.address}
            </span>
          )}
        </span>
        <ChevronsUpDownIcon className="ml-auto size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("messSwitcher.label")}</DropdownMenuLabel>
          {messes.map((mess) => (
            <DropdownMenuItem
              key={mess.id}
              onClick={() => mess.id !== messId && choose(mess.id)}
            >
              <span className="grid flex-1 leading-tight">
                <span className="truncate">{mess.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {mess.address}
                </span>
              </span>
              {mess.id === messId && <CheckIcon className="ml-auto" />}
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
