import HeadcountTableLoading from "@/components/modules/headcount/headcount-table-loading";
import PageSkeleton from "@/components/ui/page-skeleton";

export default function loading() {
  return (
    <PageSkeleton stats={false}>
      <HeadcountTableLoading />
    </PageSkeleton>
  );
}
