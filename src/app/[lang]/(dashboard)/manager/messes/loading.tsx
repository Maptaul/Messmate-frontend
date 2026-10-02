import MyMessListLoading from "@/components/modules/my-messes/my-mess-list-loading";
import PageSkeleton from "@/components/ui/page-skeleton";

export default function loading() {
  return (
    <PageSkeleton stats={false}>
      <MyMessListLoading />
    </PageSkeleton>
  );
}
