import { Skeleton } from "@/components/ui/skeleton";

export default function UserDetailLoading() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Skeleton className="h-96 rounded-xl" />
      <div className="space-y-6 lg:col-span-2">
        <Skeleton className="h-36 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </div>
  );
}
