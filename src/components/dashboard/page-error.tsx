"use client";

import { RotateCwIcon, TriangleAlertIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useGetMe } from "@/hooks";
import { useLocalePath, useT } from "@/i18n/i18n-provider";
import { getErrorMessage, ROLE_HOME } from "@/utils";

export default function PageError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const t = useT();
  const href = useLocalePath();
  const { data } = useGetMe();
  const home = data?.data ? ROLE_HOME[data.data.role] : "/";

  useEffect(() => {
    toast.error(t.dynamic(getErrorMessage(error)));
  }, [error, t]);

  return (
    <div className="grid flex-1 place-items-center px-4 py-12">
      <div className="flex max-w-110 flex-col items-center gap-3 text-center">
        <span className="grid size-12 place-items-center rounded-xl bg-destructive-tint text-destructive">
          <TriangleAlertIcon className="size-6" aria-hidden />
        </span>
        <h2 className="text-xl font-semibold tracking-[-0.01em]">
          {t("errors.pageTitle")}
        </h2>
        <p className="text-pretty text-foreground-2">{t("errors.pageBody")}</p>
        {error.digest && (
          <code className="rounded-sm border bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
            {t("errors.reference", { id: error.digest })}
          </code>
        )}
        <div className="mt-1 flex gap-2">
          <Button size="lg" onClick={() => retry()}>
            <RotateCwIcon />
            {t("common.tryAgain")}
          </Button>
          <Button
            size="lg"
            variant="outline"
            render={<Link href={href(home)} />}
            nativeButton={false}
          >
            {t("common.goHome")}
          </Button>
        </div>
      </div>
    </div>
  );
}
