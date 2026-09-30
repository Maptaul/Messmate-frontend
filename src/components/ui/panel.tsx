import type { ReactNode } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * The design's titled card. `flush` gives the header a bottom rule and lets
 * the content run edge to edge (lists, tables).
 */
export default function Panel({
  title,
  description,
  icon,
  action,
  flush,
  className,
  contentClassName,
  children,
}: {
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  flush?: boolean;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}) {
  return (
    <Card
      className={cn(
        "gap-4 py-5 shadow-1",
        flush && "gap-0 pt-0 pb-0",
        className,
      )}
    >
      {(title || action) && (
        <CardHeader className={cn("px-5", flush && "border-b py-3.5!")}>
          {title && (
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              {icon}
              {title}
            </CardTitle>
          )}
          {description && (
            <CardDescription className="text-xs">{description}</CardDescription>
          )}
          {action && <CardAction>{action}</CardAction>}
        </CardHeader>
      )}
      <CardContent className={cn("px-5", flush && "px-0", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
