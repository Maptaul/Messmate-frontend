import { Skeleton } from "@/components/ui/skeleton";

export default function HeadcountTableLoading() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="space-y-2 rounded-lg border p-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <Skeleton key={item} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}
