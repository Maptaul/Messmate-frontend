import { Skeleton } from "@/components/ui/skeleton";

export default function ManagerOverviewLoading() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-31 rounded-xl" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
      <Skeleton className="h-60 rounded-xl" />
    </div>
  );
}
