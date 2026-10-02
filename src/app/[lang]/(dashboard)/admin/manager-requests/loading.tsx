import ManagerRequestTableLoading from "@/components/modules/manager-requests/manager-request-table-loading";
import PageSkeleton from "@/components/ui/page-skeleton";

export default function loading() {
  return (
    <PageSkeleton stats={false}>
      <ManagerRequestTableLoading />
    </PageSkeleton>
  );
}
