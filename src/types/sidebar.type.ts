import type { MessageKey } from "@/i18n/translate";

export interface SidebarItem {
  title: MessageKey;
  url: string;
}

export interface SidebarGroup {
  title: MessageKey;
  items: SidebarItem[];
}

export type SidebarItems = SidebarGroup[];
