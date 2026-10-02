import MessDetailLoading from "@/components/modules/mess-management/mess-detail-loading";
import PageSkeleton from "@/components/ui/page-skeleton";

export default function loading() {
  return (
    <PageSkeleton stats={false}>
      <MessDetailLoading />
    </PageSkeleton>
  );
}
