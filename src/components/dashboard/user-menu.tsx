"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronsUpDownIcon,
  CircleUserRoundIcon,
  LogOutIcon,
  WalletIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { SidebarMenuButton } from "@/components/ui/sidebar";
import StatusBadge from "@/components/ui/status-badge";
import UserAvatar from "@/components/ui/user-avatar";
import { useGetMe, useLogout } from "@/hooks";
import { useLocalePath, useT } from "@/i18n/i18n-provider";
import { getErrorMessage, ROLE_LABEL_KEY } from "@/utils";

export default function UserMenu({
  inSidebar = false,
}: {
  inSidebar?: boolean;
}) {
  const t = useT();
  const href = useLocalePath();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data } = useGetMe();
  const { mutate: logout, isPending } = useLogout();

  const user = data?.data;

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success(t("toast.loggedOut"));
        queryClient.removeQueries({ queryKey: ["user"] });
        router.replace(href("/login"));
        router.refresh();
      },
      onError: (err) => {
        toast.error(t.dynamic(getErrorMessage(err)));
      },
    });
  };

  return (
    <DropdownMenu>
      {inSidebar ? (
        <DropdownMenuTrigger
          render={
            <SidebarMenuButton
              size="lg"
              className="h-auto gap-2.5 p-1.5"
              aria-label={user.name}
            />
          }
        >
          <UserAvatar
            name={user.name}
            src={user.avatarUrl}
            variant="ink"
            className="size-[30px]"
          />
          <span className="grid min-w-0 flex-1 leading-tight">
            <span className="truncate text-[13px] font-medium">
              {user.name}
            </span>
            <span className="truncate text-[11px] text-muted-foreground">
              {t(ROLE_LABEL_KEY[user.role])}
            </span>
          </span>
          <ChevronsUpDownIcon className="size-3.5 text-muted-foreground" />
        </DropdownMenuTrigger>
      ) : (
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 rounded-full"
              aria-label={t("userMenu.open", { name: user.name })}
            />
          }
        >
          <UserAvatar
            name={user.name}
            src={user.avatarUrl}
            variant="ink"
            className="size-[30px]"
          />
        </DropdownMenuTrigger>
      )}
      <DropdownMenuContent
        side={inSidebar ? "top" : "bottom"}
        align={inSidebar ? "start" : "end"}
        className="w-61"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2.5 pt-2 pb-2.5 font-normal">
            <p className="text-[13px] font-medium text-foreground">
              {user.name}
            </p>
            <p className="mt-0.5 truncate text-xs">{user.email}</p>
            <StatusBadge
              status={user.role}
              label={t(ROLE_LABEL_KEY[user.role])}
              className="mt-2 h-5 text-[11px]"
            />
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
          onClick={handleLogout}
        >
          <LogOutIcon />
          {t("userMenu.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
