"use client";

import { RotateCwIcon, TriangleAlertIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useLocalePath, useT } from "@/i18n/i18n-provider";
import { getErrorMessage } from "@/utils";

export default function DashboardError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const t = useT();
  const href = useLocalePath();

  useEffect(() => {
    toast.error(t.dynamic(getErrorMessage(error)));
  }, [error, t]);

  return (
    <Empty className="min-h-[60svh]">
      <EmptyHeader>
        <EmptyMedia
          variant="icon"
          className="bg-destructive/10 text-destructive"
        >
          <TriangleAlertIcon />
        </EmptyMedia>
        <EmptyTitle>{t("errors.pageTitle")}</EmptyTitle>
        <EmptyDescription>
          {t("errors.pageBody")}
          {error.digest && (
            <span className="mt-2 block font-mono text-xs">
              {t("errors.reference", { id: error.digest })}
            </span>
          )}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center">
        <Button onClick={() => retry()}>
          <RotateCwIcon />
          {t("common.tryAgain")}
        </Button>
        <Button
          variant="outline"
          render={<Link href={href("/")} />}
          nativeButton={false}
        >
          {t("common.goHome")}
        </Button>
      </EmptyContent>
    </Empty>
  );
}
