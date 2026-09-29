"use client";

import { useEffect, useState } from "react";
import MessDetailsForm from "@/components/form/mess-details-form";
import MessMembersForm from "@/components/form/mess-members-form";
import MessMoneyForm from "@/components/form/mess-money-form";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Stepper from "@/components/ui/stepper";
import { useT } from "@/i18n/i18n-provider";
import { useMessWizard, WIZARD_STEPS } from "@/stores/mess-wizard.store";
import MessReview from "./mess-review";

/** Details → Rent & deposit → Members → Review; the draft survives a reload. */
export default function MessWizard() {
  const t = useT();
  const step = useMessWizard((state) => state.step);
  const [ready, setReady] = useState(false);

  // The draft lives in sessionStorage, which the server render can't read.
  useEffect(() => {
    Promise.resolve(useMessWizard.persist.rehydrate()).then(() =>
      setReady(true),
    );
  }, []);

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardContent className="space-y-8">
        <Stepper
          label={t("manager.wizard.title")}
          current={ready ? step : 0}
          steps={WIZARD_STEPS.map((key) => t(`manager.wizard.steps.${key}`))}
        />
        {!ready ? (
          <div className="space-y-4">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : step === 0 ? (
          <MessDetailsForm />
        ) : step === 1 ? (
          <MessMoneyForm />
        ) : step === 2 ? (
          <MessMembersForm />
        ) : (
          <MessReview />
        )}
      </CardContent>
    </Card>
  );
}
