import FinanceEntryTableLoading from "@/components/modules/finance/finance-entry-table-loading";
import FinanceSummaryLoading from "@/components/modules/finance/finance-summary-loading";
import PageSkeleton from "@/components/ui/page-skeleton";

export default function loading() {
  return (
    <PageSkeleton stats={false}>
      <FinanceSummaryLoading />
      <FinanceEntryTableLoading />
    </PageSkeleton>
  );
}
