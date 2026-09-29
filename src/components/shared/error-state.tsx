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
  return (
    <Empty className="min-h-[60svh]">
      <EmptyHeader>
        <EmptyMedia
          variant="icon"
          className="bg-destructive/10 text-destructive"
        >
          <TriangleAlertIcon />
        </EmptyMedia>
        <EmptyTitle>This page hit a problem</EmptyTitle>
        <EmptyDescription>
          Your data is safe — something failed while loading this view.
          {error.digest && (
            <span className="mt-2 block font-mono text-xs">
              Reference: {error.digest}
            </span>
          )}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center">
        <Button onClick={() => retry()}>
          <RotateCwIcon />
          Try again
        </Button>
        <Button
          variant="outline"
          render={<Link href={homeHref} />}
          nativeButton={false}
        >
          Go home
        </Button>
      </EmptyContent>
    </Empty>
  );
}
