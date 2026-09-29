"use client";

import { Building2Icon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EmptyState from "@/components/ui/empty-state";
import { useSuspenseMyMesses } from "@/hooks";
import { useLocale, useLocalePath, useT } from "@/i18n/i18n-provider";
import {
  formatBDT,
  formatNumber,
  MY_MESSES_PARAMS,
  rememberActiveMess,
} from "@/utils";

export default function MyMessList({
  activeMessId,
}: {
  activeMessId: string | null;
}) {
  const t = useT();
  const locale = useLocale();
  const href = useLocalePath();
  const router = useRouter();

  const { data } = useSuspenseMyMesses(MY_MESSES_PARAMS);

  const messes = data?.data ?? [];

  const handleUse = (messId: string) => {
    rememberActiveMess(messId);
    router.refresh();
  };

  if (messes.length === 0) {
    return (
      <div className="rounded-xl border">
        <EmptyState
          icon={Building2Icon}
          title={t("manager.messes.empty")}
          description={t("manager.messes.emptyHint")}
          action={
            <Button
              render={<Link href={href("/manager/messes/new")} />}
              nativeButton={false}
            >
              <PlusIcon />
              {t("manager.messes.create")}
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {messes.map((mess) => (
        <Card key={mess.id}>
          <CardHeader>
            <CardTitle>{mess.name}</CardTitle>
            <CardDescription>{mess.address}</CardDescription>
            {mess.id === activeMessId && (
              <CardAction>
                <Badge>{t("manager.messes.current")}</Badge>
              </CardAction>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>
                {t("manager.messes.members", {
                  count: formatNumber(mess._count.members, locale),
                })}
              </li>
              <li>
                {t("manager.messes.months", {
                  count: formatNumber(mess._count.cycles, locale),
                })}
              </li>
              <li>
                {t("manager.messes.rent", {
                  amount: formatBDT(mess.monthlyRent, locale),
                })}
              </li>
            </ul>
            {mess.id !== activeMessId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUse(mess.id)}
              >
                {t("manager.messes.use")}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
