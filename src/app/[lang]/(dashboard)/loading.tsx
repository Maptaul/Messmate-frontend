import { PageSkeleton } from "@/components/shared/page-skeleton";
import { getT } from "@/i18n/get-dictionary";

export default async function ProtectedLoading() {
  const t = await getT();
  return <PageSkeleton label={t("common.loading")} />;
}
