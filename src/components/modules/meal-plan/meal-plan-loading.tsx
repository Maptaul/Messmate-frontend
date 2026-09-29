import { Skeleton } from "@/components/ui/skeleton";

export default function MealPlanLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-36 rounded-xl" />
      <div className="space-y-2 rounded-lg border p-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <Skeleton key={item} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}
