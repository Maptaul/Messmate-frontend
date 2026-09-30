import { Skeleton } from "@/components/ui/skeleton";

export default function CycleTableLoading() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(16.25rem,1fr))] gap-4">
      {Array.from({ length: 6 }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
        <Skeleton key={index} className="h-36 rounded-xl" />
      ))}
    </div>
  );
}
