import MyPaymentTableLoading from "@/components/modules/my-payments/my-payment-table-loading";
import PageSkeleton from "@/components/ui/page-skeleton";

export default function loading() {
  return (
    <PageSkeleton stats={false}>
      <MyPaymentTableLoading />
    </PageSkeleton>
  );
}
