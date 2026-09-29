import {
  CalendarCheck2Icon,
  ReceiptTextIcon,
  WalletCardsIcon,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";

const POINTS = [
  {
    icon: CalendarCheck2Icon,
    title: "Plan meals before 11 PM",
    body: "Everyone marks tomorrow's lunch and dinner; the cook sees the headcount.",
  },
  {
    icon: ReceiptTextIcon,
    title: "One ledger, no arguments",
    body: "Groceries, gas, rent and deposits are recorded once and visible to all.",
  },
  {
    icon: WalletCardsIcon,
    title: "Month-end bill in one click",
    body: "Close the cycle, every member gets their share — pay by card or bKash.",
  },
];

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-8 p-6 md:p-10">
        <Logo />
        <main className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </main>
      </div>

      <aside className="relative hidden flex-col justify-center gap-10 overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <div
          aria-hidden
          className="absolute -top-24 -right-24 size-96 rounded-full bg-primary-foreground/10 blur-3xl"
        />
        <div className="relative space-y-3">
          <p className="text-sm font-medium tracking-widest uppercase opacity-80">
            For shared messes in Bangladesh
          </p>
          <h2 className="max-w-md text-4xl leading-tight font-semibold text-balance">
            The whole month's khata, settled without a notebook.
          </h2>
        </div>
        <ul className="relative space-y-6">
          {POINTS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/15">
                <Icon className="size-5" aria-hidden />
              </span>
              <div>
                <p className="font-medium">{title}</p>
                <p className="text-sm opacity-80">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
