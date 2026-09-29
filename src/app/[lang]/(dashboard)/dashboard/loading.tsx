import { Skeleton } from "@/components/ui/skeleton";

export default function loading() {
  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="space-y-2 rounded-lg border p-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <Skeleton key={item} className="h-10 w-full" />
        ))}
      </div>
    </section>
  );
}
