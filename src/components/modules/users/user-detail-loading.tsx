import { Skeleton } from "@/components/ui/skeleton";

export default function UserDetailLoading() {
  return (
    <>
      <Skeleton className="h-32 rounded-xl" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
    </>
  );
}
