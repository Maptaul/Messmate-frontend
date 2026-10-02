import ActivityTableLoading from "@/components/modules/activity/activity-table-loading";
import PageSkeleton from "@/components/ui/page-skeleton";

export default function loading() {
  return (
    <PageSkeleton stats={false}>
      <ActivityTableLoading />
    </PageSkeleton>
  );
}
