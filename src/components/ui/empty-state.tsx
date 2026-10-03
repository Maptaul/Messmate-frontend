import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2.5 rounded-xl border border-dashed border-border-strong bg-card px-6 py-14 text-center",
        className,
      )}
    >
      <span className="grid size-12 place-items-center rounded-xl border bg-muted">
        <Icon className="size-6 text-muted-foreground" aria-hidden />
      </span>
      <p className="text-base font-semibold">{title}</p>
      {description && (
        <p className="max-w-100 text-pretty text-foreground-2">{description}</p>
      )}
      {action && <div className="mt-1.5">{action}</div>}
    </div>
  );
}
