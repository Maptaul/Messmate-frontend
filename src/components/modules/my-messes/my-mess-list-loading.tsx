import { Skeleton } from "@/components/ui/skeleton";

export default function MyMessListLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <Skeleton key={item} className="h-48 rounded-xl" />
      ))}
    </div>
  );
}
