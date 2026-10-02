import UserTableLoading from "@/components/modules/users/user-table-loading";
import PageSkeleton from "@/components/ui/page-skeleton";

export default function loading() {
  return (
    <PageSkeleton stats={false}>
      <UserTableLoading />
    </PageSkeleton>
  );
}
