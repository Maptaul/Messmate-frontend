import CycleTableLoading from "@/components/modules/cycles/cycle-table-loading";
import PageSkeleton from "@/components/ui/page-skeleton";

export default function loading() {
  return (
    <PageSkeleton stats={false}>
      <CycleTableLoading />
    </PageSkeleton>
  );
}
