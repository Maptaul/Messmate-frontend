import MessTableLoading from "@/components/modules/mess-management/mess-table-loading";
import PageSkeleton from "@/components/ui/page-skeleton";

export default function loading() {
  return (
    <PageSkeleton stats={false}>
      <MessTableLoading />
    </PageSkeleton>
  );
}
