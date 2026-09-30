import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Numbered progress for a multi-step form: every step up to `current` is
 * filled, finished ones show a tick. Phones get "Step n of N" and a bar.
 */
export default function Stepper({
  steps,
  current,
  label,
  short,
}: {
  steps: string[];
  current: number;
  label: string;
  short: string;
}) {
  const percent = (Math.min(current + 1, steps.length) / steps.length) * 100;

  return (
    <>
      <div className="flex flex-col gap-2 sm:hidden">
        <span className="font-medium">{short}</span>
        <div className="h-1.5 rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      <ol aria-label={label} className="hidden gap-2 sm:flex">
        {steps.map((step, index) => {
          const done = index < current;
          const active = index === current;

          return (
            <li
              key={step}
              aria-current={active ? "step" : undefined}
              className="flex min-w-0 flex-1 items-center gap-2"
            >
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full border bg-background text-[13px] font-semibold text-muted-foreground",
                  (done || active) &&
                    "border-primary bg-primary text-primary-foreground",
                )}
              >
                {done ? (
                  <CheckIcon className="size-4" aria-hidden />
                ) : (
                  index + 1
                )}
              </span>
              <span
                className={cn(
                  "font-medium whitespace-nowrap text-muted-foreground",
                  active && "font-semibold text-foreground",
                )}
              >
                {step}
              </span>
              {index < steps.length - 1 && (
                <span aria-hidden className="h-px min-w-3 flex-1 bg-border" />
              )}
            </li>
          );
        })}
      </ol>
    </>
  );
}
