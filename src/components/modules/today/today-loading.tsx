import { Skeleton } from "@/components/ui/skeleton";

export default function TodayLoading() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-64" />
        <Skeleton className="h-7 w-32" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Skeleton className="h-72 rounded-xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-44 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
      </div>
      <Skeleton className="h-48 rounded-xl md:h-28" />
      <Skeleton className="h-48 rounded-xl" />
    </>
  );
}
