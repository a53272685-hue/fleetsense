/**
 * Avatar — initials circle for vehicle identifier cell.
 * Figma: 2223:11444 "Avatar" (40×40)
 *  - bg-tertiary (#f5f5f5), border-secondary (#dcdfea) 1px
 *  - rounded-full
 *  - text: Inter text-md (16/24) semibold, text-quaternary (#717680)
 */
import { cn } from "@/lib/utils";

export function Avatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center",
        "rounded-full border border-border-secondary bg-bg-tertiary",
        "text-base font-semibold text-text-quaternary",
        className,
      )}
    >
      {initials}
    </div>
  );
}
