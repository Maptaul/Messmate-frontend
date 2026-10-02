import ExpenseTableLoading from "@/components/modules/expenses/expense-table-loading";
import PageSkeleton from "@/components/ui/page-skeleton";

export default function loading() {
  return (
    <PageSkeleton>
      <ExpenseTableLoading />
    </PageSkeleton>
  );
}
