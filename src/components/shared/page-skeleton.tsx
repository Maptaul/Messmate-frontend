import { Skeleton } from "@/components/ui/skeleton";

/** Header, a row of stat cards and a table — the shape of most dashboard pages. */
export function PageSkeleton({
  stats = 4,
  rows = 6,
}: {
  stats?: number;
  rows?: number;
}) {
  return (
    <section
      aria-busy="true"
      aria-label="Loading"
      className="flex flex-col gap-6"
    >
      <div className="space-y-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      {stats > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: stats }, (_, card) => card).map((card) => (
            <Skeleton key={card} className="h-28 rounded-xl" />
          ))}
        </div>
      )}
      <div className="space-y-2 rounded-xl border p-4">
        <Skeleton className="h-9 w-full max-w-sm" />
        {Array.from({ length: rows }, (_, row) => row).map((row) => (
          <Skeleton key={row} className="h-10 w-full" />
        ))}
      </div>
    </section>
  );
}
