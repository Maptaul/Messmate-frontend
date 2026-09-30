"use client";

import { useEffect, useState } from "react";
import MessDetailsForm from "@/components/form/mess-details-form";
import MessMembersForm from "@/components/form/mess-members-form";
import MessMoneyForm from "@/components/form/mess-money-form";
import { Skeleton } from "@/components/ui/skeleton";
import Stepper from "@/components/ui/stepper";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { useMessWizard, WIZARD_STEPS } from "@/stores/mess-wizard.store";
import { formatNumber } from "@/utils";
import MessCreated, { type CreatedMess } from "./mess-created";
import MessReview from "./mess-review";

/** Details → Money → Members → Review; the draft survives a reload. */
export default function MessWizard() {
  const t = useT();
  const locale = useLocale();
  const step = useMessWizard((state) => state.step);
  const [ready, setReady] = useState(false);
  const [created, setCreated] = useState<CreatedMess | null>(null);

  // The draft lives in localStorage, which the server render can't read.
  useEffect(() => {
    Promise.resolve(useMessWizard.persist.rehydrate()).then(() =>
      setReady(true),
    );
  }, []);

  if (created) return <MessCreated {...created} />;

  const current = ready ? step : 0;

  return (
    <>
      <Stepper
        label={t("manager.wizard.title")}
        current={current}
        short={t("manager.wizard.stepOf", {
          current: formatNumber(current + 1, locale),
          total: formatNumber(WIZARD_STEPS.length, locale),
        })}
        steps={WIZARD_STEPS.map((key) => t(`manager.wizard.steps.${key}`))}
      />
      {!ready ? (
        <Skeleton className="h-64 rounded-xl" />
      ) : step === 0 ? (
        <MessDetailsForm />
      ) : step === 1 ? (
        <MessMoneyForm />
      ) : step === 2 ? (
        <MessMembersForm />
      ) : (
        <MessReview onCreated={setCreated} />
      )}
    </>
  );
}
