import MyBillTableLoading from "@/components/modules/my-bills/my-bill-table-loading";
import PageSkeleton from "@/components/ui/page-skeleton";

export default function loading() {
  return (
    <PageSkeleton stats={false}>
      <MyBillTableLoading />
    </PageSkeleton>
  );
}
