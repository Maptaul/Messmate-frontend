import DutyTableLoading from "@/components/modules/grocery-duty/duty-table-loading";
import PageSkeleton from "@/components/ui/page-skeleton";

export default function loading() {
  return (
    <PageSkeleton stats={false}>
      <DutyTableLoading />
    </PageSkeleton>
  );
}
