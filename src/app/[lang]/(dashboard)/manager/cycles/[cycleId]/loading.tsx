import CycleSummaryLoading from "@/components/modules/cycles/cycle-summary-loading";
import PageSkeleton from "@/components/ui/page-skeleton";

export default function loading() {
  return (
    <PageSkeleton stats={false}>
      <CycleSummaryLoading />
    </PageSkeleton>
  );
}
