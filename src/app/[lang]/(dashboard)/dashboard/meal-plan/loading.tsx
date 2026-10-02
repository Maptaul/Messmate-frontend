import MealPlanLoading from "@/components/modules/meal-plan/meal-plan-loading";
import PageSkeleton from "@/components/ui/page-skeleton";

export default function loading() {
  return (
    <PageSkeleton stats={false}>
      <MealPlanLoading />
    </PageSkeleton>
  );
}
