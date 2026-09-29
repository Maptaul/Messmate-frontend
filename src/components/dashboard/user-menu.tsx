"use client";

import { useQueryClient } from "@tanstack/react-query";
import { CircleUserRoundIcon, LogOutIcon, WalletIcon } from "lucide-react";
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
import UserAvatar from "@/components/ui/user-avatar";
import { useGetMe, useLogout } from "@/hooks";
import { useLocalePath, useT } from "@/i18n/i18n-provider";
import { getErrorMessage, ROLE_LABEL_KEY } from "@/utils";

export default function UserMenu() {
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
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label={user.name}
          />
        }
      >
        <UserAvatar name={user.name} src={user.avatarUrl} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <p className="font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
            <p className="text-xs text-muted-foreground">
              {t(ROLE_LABEL_KEY[user.role])}
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
          onClick={handleLogout}
        >
          <LogOutIcon />
          {t("userMenu.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
