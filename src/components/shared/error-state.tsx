"use client";

import { RotateCwIcon, TriangleAlertIcon } from "lucide-react";
import Link from "next/link";
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

/** What an error boundary shows: what happened, and two ways out. */
export function ErrorState({
  error,
  retry,
  homeHref = "/",
}: {
  error: Error & { digest?: string };
  retry: () => void;
  homeHref?: string;
}) {
  const t = useT();
  const href = useLocalePath();

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
          render={<Link href={href(homeHref)} />}
          nativeButton={false}
        >
          {t("common.goHome")}
        </Button>
      </EmptyContent>
    </Empty>
  );
}
