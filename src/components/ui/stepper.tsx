import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Numbered progress for a multi-step form; steps before `current` show a tick. */
export default function Stepper({
  steps,
  current,
  label,
}: {
  steps: string[];
  current: number;
  label: string;
}) {
  return (
    <ol aria-label={label} className="flex items-center gap-2">
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;

        return (
          <li
            key={step}
            aria-current={active ? "step" : undefined}
            className="flex min-w-0 flex-1 items-center gap-2 last:flex-none"
          >
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                done && "border-primary bg-primary text-primary-foreground",
                active && "border-primary text-primary",
                !done && !active && "text-muted-foreground",
              )}
            >
              {done ? <CheckIcon className="size-4" aria-hidden /> : index + 1}
            </span>
            <span
              className={cn(
                "hidden truncate text-sm sm:inline",
                active ? "font-medium" : "text-muted-foreground",
              )}
            >
              {step}
            </span>
            {index < steps.length - 1 && (
              <span
                aria-hidden
                className={cn("h-px flex-1 bg-border", done && "bg-primary")}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
