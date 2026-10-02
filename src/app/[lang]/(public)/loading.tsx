import BrandLoader from "@/components/ui/brand-loader";
import { getT } from "@/i18n/get-dictionary";

export default async function loading() {
  const t = await getT();

  return <BrandLoader label={t("common.loading")} />;
}
