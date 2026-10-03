"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useT } from "@/i18n/i18n-provider";

export function StepCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4.5 rounded-xl border bg-card p-6 shadow-1">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </div>
  );
}

/**
 * Back on the left, Next on the right, pinned to the bottom of the screen.
 * Next submits the step's form unless `onNext` is given.
 */
export default function StepNav({
  onBack,
  onNext,
  nextLabel,
  pending,
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  pending?: boolean;
}) {
  const t = useT();

  return (
    <div className="sticky bottom-0 flex items-center justify-between gap-2 bg-background py-3">
      {onBack ? (
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={pending}
          onClick={onBack}
        >
          <ArrowLeftIcon />
          {t("manager.wizard.back")}
        </Button>
      ) : (
        <span />
      )}
      <Button
        type={onNext ? "button" : "submit"}
        size="lg"
        disabled={pending}
        onClick={onNext}
      >
        {pending && <Spinner />}
        {nextLabel ?? t("manager.wizard.next")}
        {!pending && <ArrowRightIcon />}
      </Button>
    </div>
  );
}
