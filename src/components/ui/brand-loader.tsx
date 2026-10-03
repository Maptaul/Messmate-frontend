import Logo from "@/assets/svg/Logo";

export default function BrandLoader({ label }: { label: string }) {
  return (
    <output className="fixed inset-0 z-50 grid animate-loader-in place-items-center bg-background">
      <span className="flex flex-col items-center gap-6">
        <span className="relative grid size-28 place-items-center">
          <span
            aria-hidden
            className="absolute inset-2 animate-pulse rounded-full bg-primary/15 blur-xl"
          />
          <span
            aria-hidden
            className="absolute inset-0 rounded-full border-3 border-primary/15"
          />
          <span
            aria-hidden
            className="absolute inset-0 animate-spin rounded-full border-3 border-transparent border-t-primary [animation-duration:1.1s]"
          />
          <Logo className="relative h-13 w-auto animate-logo-breathe" />
        </span>
        <span className="flex flex-col items-center gap-3">
          <span className="text-xl font-semibold tracking-tight">MessMate</span>
          <span
            aria-hidden
            className="h-1 w-36 overflow-hidden rounded-full bg-muted"
          >
            <span className="block h-full w-1/3 animate-loader-slide rounded-full bg-primary" />
          </span>
        </span>
        <span className="sr-only">{label}</span>
      </span>
    </output>
  );
}
