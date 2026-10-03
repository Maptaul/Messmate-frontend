import { CalendarPlusIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";

export default async function NoCycle() {
  const [t, locale] = await Promise.all([getT(), getLocale()]);

  return (
    <div className="rounded-xl border">
      <EmptyState
        icon={CalendarPlusIcon}
        title={t("manager.noCycleHint.title")}
        description={t("manager.noCycleHint.body")}
        action={
          <Button
            render={<Link href={localePath(locale, "/manager/cycles")} />}
            nativeButton={false}
          >
            {t("manager.noCycleHint.cta")}
          </Button>
        }
      />
    </div>
  );
}
