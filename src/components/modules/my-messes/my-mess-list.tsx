"use client";

import {
  ArrowLeftRightIcon,
  Building2Icon,
  PlusIcon,
  SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import StatusBadge from "@/components/ui/status-badge";
import { useSuspenseMyMesses } from "@/hooks";
import { useLocale, useLocalePath, useT } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";
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

  const handleUse = (messId: string, name: string) => {
    rememberActiveMess(messId);
    toast.success(t("manager.messes.switched", { name }));
    router.refresh();
  };

  if (messes.length === 0) {
    return (
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
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
      {messes.map((mess) => {
        const isCurrent = mess.id === activeMessId;
        return (
          <div
            key={mess.id}
            className={cn(
              "flex flex-col gap-3.5 rounded-xl border bg-card p-5",
              isCurrent && "border-ring",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="grid gap-0.5">
                <span className="text-sm font-semibold">{mess.name}</span>
                <span className="text-[13px] text-muted-foreground">
                  {mess.address}
                </span>
              </div>
              {isCurrent && (
                <StatusBadge
                  status="current"
                  label={t("manager.messes.current")}
                  tone="tone-g"
                />
              )}
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[13px]">
              {[
                [
                  t("manager.messes.statMembers"),
                  formatNumber(mess._count.members, locale),
                ],
                [
                  t("manager.messes.statCycles"),
                  formatNumber(mess._count.cycles, locale),
                ],
                [
                  t("manager.messes.statRent"),
                  formatBDT(mess.monthlyRent, locale),
                ],
                [
                  t("manager.messes.statAdvance"),
                  formatBDT(mess.monthlyDeposit, locale),
                ],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={isCurrent}
                onClick={() => handleUse(mess.id, mess.name)}
              >
                <ArrowLeftRightIcon />
                {t("manager.messes.switchTo")}
              </Button>
              <Button
                variant="ghost"
                render={<Link href={href("/manager/settings")} />}
                nativeButton={false}
                onClick={() => !isCurrent && rememberActiveMess(mess.id)}
              >
                <SettingsIcon />
                {t("manager.messes.settings")}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
