import {
  CalendarCheck2Icon,
  ReceiptTextIcon,
  WalletCardsIcon,
} from "lucide-react";
import { getT } from "@/i18n/get-dictionary";

export default async function AuthAside() {
  const t = await getT();

  const points = [
    { icon: CalendarCheck2Icon, title: t("auth.layout.planTitle") },
    { icon: ReceiptTextIcon, title: t("auth.layout.ledgerTitle") },
    { icon: WalletCardsIcon, title: t("auth.layout.billTitle") },
  ];

  return (
    <aside className="relative hidden flex-col justify-center overflow-hidden bg-brand-panel bg-[radial-gradient(rgba(255,255,255,.07)_1px,transparent_1px)] bg-size-[22px_22px] px-14 py-16 text-[#f4f4f0] lg:flex">
      <div className="flex max-w-115 flex-col gap-5.5">
        <span className="flex h-7 w-fit items-center gap-2 rounded-full border border-[rgba(31,158,90,.35)] bg-[rgba(31,158,90,.18)] px-3 text-[13px] font-medium text-[#6fdba2]">
          <span className="size-1.5 rounded-full bg-current" />
          {t("auth.layout.eyebrow")}
        </span>
        <h2 className="text-4xl leading-[1.12] font-semibold tracking-tight text-balance text-white">
          {t("auth.layout.title")}
        </h2>
        <ul className="flex flex-col gap-3.5">
          {points.map(({ icon: Icon, title }) => (
            <li
              key={title}
              className="flex items-center gap-3 text-[15px] text-[#b7bcc4]"
            >
              <span className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/6 text-[#6fdba2]">
                <Icon className="size-4" aria-hidden />
              </span>
              {title}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
