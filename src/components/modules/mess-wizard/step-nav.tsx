"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/i18n-provider";

/** Back on the left, Next on the right; Next submits unless `onNext` is given. */
export default function StepNav({
  onBack,
  onNext,
}: {
  onBack?: () => void;
  onNext?: () => void;
}) {
  const t = useT();

  return (
    <div className="flex items-center justify-between gap-3 pt-2">
      {onBack ? (
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeftIcon />
          {t("manager.wizard.back")}
        </Button>
      ) : (
        <span />
      )}
      <Button type={onNext ? "button" : "submit"} onClick={onNext}>
        {t("manager.wizard.next")}
        <ArrowRightIcon />
      </Button>
    </div>
  );
}
