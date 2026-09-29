import { Skeleton } from "@/components/ui/skeleton";

export default function MealRegisterLoading() {
  return (
    <div className="space-y-2 rounded-lg border p-4">
      {[1, 2, 3, 4, 5].map((item) => (
        <Skeleton key={item} className="h-10 w-full" />
      ))}
    </div>
  );
}
