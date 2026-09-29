import { CalendarClockIcon, HomeIcon } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";
import { getT } from "@/i18n/get-dictionary";

/** Shown to a resident who isn't in a mess yet, or whose mess has no open month. */
export default async function ResidentEmpty({
  kind,
}: {
  kind: "no-mess" | "no-cycle";
}) {
  const t = await getT();
  const key = kind === "no-mess" ? "resident.noMess" : "resident.noCycle";

  return (
    <div className="rounded-xl border">
      <EmptyState
        icon={kind === "no-mess" ? HomeIcon : CalendarClockIcon}
        title={t(`${key}.title`)}
        description={t(`${key}.body`)}
      />
    </div>
  );
}
