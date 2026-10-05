import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export default function UserAvatar({
  name,
  src,
  variant = "tint",
  className,
}: {
  name: string;
  src?: string | null;
  /** "ink" is the signed-in user's own avatar; "tint" everyone else. */
  variant?: "tint" | "ink";
  className?: string;
}) {
  return (
    <Avatar className={cn("size-8", className)}>
      <AvatarFallback
        className={cn(
          "text-[11px] font-semibold",
          variant === "tint"
            ? "bg-primary-tint text-primary"
            : "bg-foreground text-background",
        )}
      >
        {initialsOf(name)}
      </AvatarFallback>
      {/* Over the initials, so they show while the photo loads or if it fails. */}
      {src && (
        <Image
          src={src}
          alt=""
          fill
          sizes="80px"
          className="rounded-full object-cover"
        />
      )}
    </Avatar>
  );
}
