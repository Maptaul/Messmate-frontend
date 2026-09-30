"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useLocalePath, useT } from "@/i18n/i18n-provider";
import { ROLE_ROUTES } from "@/routes";
import type { UserRole } from "@/types";

/** ⌘K / Ctrl+K: jump to any page of this role. */
export default function CommandMenu({ role }: { role: UserRole }) {
  const t = useT();
  const href = useLocalePath();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (url: string) => {
    setOpen(false);
    router.push(href(url));
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden h-8 min-w-50 items-center gap-2 rounded-md border bg-card pr-2 pl-2.5 text-[13px] text-muted-foreground transition-colors hover:border-border-strong min-[1100px]:flex"
      >
        <SearchIcon className="size-3.5" />
        <span className="flex-1 text-left">{t("shell.jumpTo")}</span>
        <span className="flex gap-0.5">
          <kbd className="rounded border bg-muted px-1.5 font-mono text-[10px]">
            ⌘
          </kbd>
          <kbd className="rounded border bg-muted px-1.5 font-mono text-[10px]">
            K
          </kbd>
        </span>
      </button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title={t("shell.jumpTo")}
        description={t("shell.jumpPlaceholder")}
      >
        <CommandInput placeholder={t("shell.jumpPlaceholder")} />
        <CommandList>
          <CommandEmpty>{t("shell.noResults")}</CommandEmpty>
          {ROLE_ROUTES[role].map((group) => (
            <CommandGroup key={group.title} heading={t(group.title)}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.url}
                  value={`${t(item.title)} ${item.url}`}
                  onSelect={() => go(item.url)}
                >
                  <item.icon className="text-muted-foreground" />
                  {t(item.title)}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
