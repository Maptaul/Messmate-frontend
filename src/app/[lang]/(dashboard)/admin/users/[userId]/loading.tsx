import UserDetailLoading from "@/components/modules/users/user-detail-loading";
import PageSkeleton from "@/components/ui/page-skeleton";

export default function loading() {
  return (
    <PageSkeleton stats={false}>
      <UserDetailLoading />
    </PageSkeleton>
  );
}
