"use client";

import {
  ChevronsUpDownIcon,
  CircleUserRoundIcon,
  LogOutIcon,
  WalletIcon,
} from "lucide-react";
import Link from "next/link";
import { UserAvatar } from "@/components/shared/user-avatar";
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
import { useLogout } from "@/hooks";
import { useLocalePath, useT } from "@/i18n/i18n-provider";
import { ROLE_LABEL_KEY } from "@/lib/constants";
import { useSession } from "@/providers/session-provider";

export function UserMenu({ avatarUrl }: { avatarUrl?: string | null }) {
  const user = useSession();
  const t = useT();
  const href = useLocalePath();
  const { mutate: logOut, isPending } = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <SidebarMenuButton
            size="lg"
            className="data-popup-open:bg-sidebar-accent"
          />
        }
      >
        <UserAvatar name={user.name} src={avatarUrl} className="rounded-lg" />
        <span className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{user.name}</span>
          <span className="truncate text-xs text-muted-foreground">
            {t(ROLE_LABEL_KEY[user.role])}
          </span>
        </span>
        <ChevronsUpDownIcon className="ml-auto size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="min-w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <p className="font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href={href("/profile")} />}>
          <CircleUserRoundIcon />
          {t("userMenu.profile")}
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href={href("/finance")} />}>
          <WalletIcon />
          {t("userMenu.finance")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={isPending}
          onClick={() => logOut()}
        >
          <LogOutIcon />
          {t("userMenu.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
