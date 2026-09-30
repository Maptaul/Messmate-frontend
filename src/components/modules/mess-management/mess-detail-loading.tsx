import { Skeleton } from "@/components/ui/skeleton";

export default function MessDetailLoading() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} className="h-17 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-8 w-64 rounded-lg" />
      <Skeleton className="h-72 rounded-xl" />
    </>
  );
}
