import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PageSkeleton({
  stats = true,
  children,
}: {
  stats?: boolean;
  children?: ReactNode;
}) {
  return (
    <section
      aria-busy="true"
      className="flex flex-col gap-5 p-4 md:px-8 md:py-6"
    >
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-30 rounded-sm" />
        <Skeleton className="h-6.5 w-65 max-w-[70%]" />
      </div>
      {stats && (
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="flex h-31 flex-col gap-3.5 rounded-xl border bg-card p-4.5"
            >
              <Skeleton className="h-2.5 w-1/2 rounded-sm" />
              <Skeleton className="h-6.5 w-3/5" />
              <Skeleton className="h-2.5 w-4/5 rounded-sm" />
            </div>
          ))}
        </div>
      )}
      {children ?? (
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="h-10 border-b bg-muted" />
          <div className="px-4 py-1.5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 border-b py-3 last:border-0"
              >
                <Skeleton className="size-7 rounded-full" />
                <Skeleton className="h-2.5 flex-1 rounded-sm" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
