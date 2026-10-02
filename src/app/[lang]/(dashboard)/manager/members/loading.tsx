import MemberTableLoading from "@/components/modules/members/member-table-loading";
import PageSkeleton from "@/components/ui/page-skeleton";

export default function loading() {
  return (
    <PageSkeleton stats={false}>
      <MemberTableLoading />
    </PageSkeleton>
  );
}
