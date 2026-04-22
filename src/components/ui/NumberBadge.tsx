/**
 * NumberBadge — colored square badge for MPG-style numeric accent.
 * Figma: 19545:5410 "Number badge" (bg-50, border-200, text-700)
 *  - rounded-sm (6px)
 *  - px-sm (6px) py-xxs (2px)
 *  - text-xs 12/18 medium
 */
import { cn } from "@/lib/utils";

export type NumberBadgeTone = "error" | "warning" | "success" | "gray";

const TONE: Record<NumberBadgeTone, string> = {
  error: "bg-error-50 border-error-200 text-error-700",
  warning: "bg-warning-50 border-warning-200 text-warning-700",
  success: "bg-success-50 border-success-200 text-success-700",
  gray: "bg-gray-100 border-gray-200 text-gray-700",
};

export function NumberBadge({
  tone,
  children,
}: {
  tone: NumberBadgeTone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-sm py-xxs",
        "text-xs font-medium whitespace-nowrap",
        TONE[tone],
      )}
    >
      {children}
    </span>
  );
}
