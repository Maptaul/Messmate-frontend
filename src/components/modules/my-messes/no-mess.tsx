import { Building2Icon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import { getLocale, getT } from "@/i18n/get-dictionary";
import { localePath } from "@/i18n/locale-path";

/** What a manager sees on any mess page before they have created a mess. */
export default async function NoMess() {
  const [t, locale] = await Promise.all([getT(), getLocale()]);

  return (
    <div className="rounded-xl border">
      <EmptyState
        icon={Building2Icon}
        title={t("manager.noMess.title")}
        description={t("manager.noMess.body")}
        action={
          <Button
            render={<Link href={localePath(locale, "/manager/messes/new")} />}
            nativeButton={false}
          >
            <PlusIcon />
            {t("manager.noMess.cta")}
          </Button>
        }
      />
    </div>
  );
}
