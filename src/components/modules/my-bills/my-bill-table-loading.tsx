import { Skeleton } from "@/components/ui/skeleton";

export default function MyBillTableLoading() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Skeleton className="h-[30rem] rounded-xl" />
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}
