import MealRegisterLoading from "@/components/modules/meal-register/meal-register-loading";
import PageSkeleton from "@/components/ui/page-skeleton";

export default function loading() {
  return (
    <PageSkeleton stats={false}>
      <MealRegisterLoading />
    </PageSkeleton>
  );
}
