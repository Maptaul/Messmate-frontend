"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocalePath, useT } from "@/i18n/i18n-provider";
import { splitLocale } from "@/i18n/locale-path";
import type { MessageKey } from "@/i18n/translate";
import { ROLE_ROUTES } from "@/routes";
import { useCrumbStore } from "@/stores/crumb.store";
import type { UserRole } from "@/types";
import { ROLE_HOME, ROLE_LABEL_KEY } from "@/utils";

const FIXED_CRUMBS: Record<string, MessageKey> = {
  "/manager/messes/new": "messSwitcher.create",
};

interface Crumb {
  label: string;
  href?: string;
}

export default function HeaderBreadcrumb({ role }: { role: UserRole }) {
  const t = useT();
  const href = useLocalePath();
  const pathname = usePathname();
  const detail = useCrumbStore((state) => state.label);

  const { path } = splitLocale(pathname);
  const items = ROLE_ROUTES[role].flatMap((group) => group.items);
  // The longest sidebar path this page sits under.
  const item = items
    .filter((entry) => path === entry.url || path.startsWith(`${entry.url}/`))
    .sort((a, b) => b.url.length - a.url.length)[0];

  const isAccount = ["/profile", "/finance", "/payment"].some((prefix) =>
    path.startsWith(prefix),
  );
  const crumbs: Crumb[] = isAccount
    ? [{ label: t("shell.account"), href: "/profile" }]
    : [{ label: t(ROLE_LABEL_KEY[role]), href: ROLE_HOME[role] }];

  if (item && item.url !== ROLE_HOME[role]) {
    crumbs.push({ label: t(item.title), href: item.url });
  } else if (path.startsWith("/payment")) {
    crumbs.push({ label: t("shell.payment") });
  }
  if (item && path !== item.url) {
    const fixed = FIXED_CRUMBS[path];
    const label = fixed ? t(fixed) : detail;
    if (label) crumbs.push({ label });
  }

  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className="flex-nowrap gap-1.5 text-[13px] sm:gap-1.5">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <Fragment key={`${crumb.label}-${index}`}>
              {index > 0 && (
                <BreadcrumbSeparator className="hidden text-border-strong md:list-item">
                  /
                </BreadcrumbSeparator>
              )}
              <BreadcrumbItem
                className={isLast ? "min-w-0" : "hidden md:inline-flex"}
              >
                {isLast || !crumb.href ? (
                  <BreadcrumbPage className="truncate font-medium">
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    render={<Link href={href(crumb.href)} />}
                    className="whitespace-nowrap"
                  >
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
