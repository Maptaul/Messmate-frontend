import PageSkeleton from "@/components/ui/page-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

/** While the dashboard shell loads: its sidebar, its header and a page. */
export default function loading() {
  return (
    <div aria-busy="true" className="flex min-h-svh w-full">
      <aside className="hidden w-64 shrink-0 flex-col gap-6 border-r bg-sidebar p-4 md:flex">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-12 rounded-lg" />
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5, 6, 7].map((item) => (
            <Skeleton key={item} className="h-4 w-4/5 rounded-sm" />
          ))}
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b px-3 md:px-5">
          <Skeleton className="size-7 rounded-md" />
          <Skeleton className="h-4 w-32 rounded-sm" />
          <div className="flex-1" />
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="size-8 rounded-lg" />
          <Skeleton className="size-8 rounded-full" />
        </header>
        <PageSkeleton />
      </div>
    </div>
  );
}
