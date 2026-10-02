import BillTableLoading from "@/components/modules/bills/bill-table-loading";
import PageSkeleton from "@/components/ui/page-skeleton";

export default function loading() {
  return (
    <PageSkeleton>
      <BillTableLoading />
    </PageSkeleton>
  );
}
