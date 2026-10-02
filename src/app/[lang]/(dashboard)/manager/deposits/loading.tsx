import DepositTableLoading from "@/components/modules/deposits/deposit-table-loading";
import PageSkeleton from "@/components/ui/page-skeleton";

export default function loading() {
  return (
    <PageSkeleton stats={false}>
      <DepositTableLoading />
    </PageSkeleton>
  );
}
