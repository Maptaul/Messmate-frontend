import type { LucideIcon } from "lucide-react";
import type { MessageKey } from "@/i18n/translate";

export interface SidebarItem {
  title: MessageKey;
  url: string;
  icon: LucideIcon;
}

export interface SidebarGroup {
  title: MessageKey;
  items: SidebarItem[];
}

export type SidebarItems = SidebarGroup[];
