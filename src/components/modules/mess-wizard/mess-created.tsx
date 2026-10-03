"use client";

import { ArrowRightIcon, CircleCheckIcon, CircleXIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLocale, useLocalePath, useT } from "@/i18n/i18n-provider";
import { formatNumber } from "@/utils";

export interface CreatedMess {
  name: string;
  results: { email: string; error?: string }[];
}

export default function MessCreated({ name, results }: CreatedMess) {
  const t = useT();
  const locale = useLocale();
  const href = useLocalePath();
  const router = useRouter();
  const added = results.filter((row) => !row.error).length;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-4.5 rounded-xl border bg-card p-6 shadow-1">
        <div className="flex items-center gap-2.5">
          <span className="tone-g grid size-10 place-items-center rounded-xl">
            <CircleCheckIcon className="size-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold">
              {t("manager.wizard.createdTitle", { name })}
            </h2>
            <p className="text-muted-foreground">
              {results.length > 0
                ? t("manager.wizard.addedCount", {
                    added: formatNumber(added, locale),
                    total: formatNumber(results.length, locale),
                  })
                : t("manager.wizard.noMembersAdded")}
            </p>
          </div>
        </div>
        {results.length > 0 && (
          <ul className="overflow-hidden rounded-xl border">
            {results.map(({ email, error }) => (
              <li
                key={email}
                className="flex items-center gap-2.5 border-b px-3.5 py-2.5 last:border-0"
              >
                {error ? (
                  <CircleXIcon className="size-4 text-(--tone-r-fg)" />
                ) : (
                  <CircleCheckIcon className="size-4 text-(--tone-g-fg)" />
                )}
                <span className="flex-1 break-all">{email}</span>
                <span
                  className={
                    error
                      ? "text-[13px] text-(--tone-r-fg)"
                      : "text-[13px] text-(--tone-g-fg)"
                  }
                >
                  {error ? t.dynamic(error) : t("manager.wizard.added")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex justify-end py-3">
        <Button
          size="lg"
          className="px-4"
          onClick={() => {
            router.replace(href("/manager"));
            router.refresh();
          }}
        >
          {t("manager.wizard.goMess")}
          <ArrowRightIcon />
        </Button>
      </div>
    </div>
  );
}
