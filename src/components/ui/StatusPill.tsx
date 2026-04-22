/**
 * StatusPill — colored rounded-full badge (Optimal / Moderate / Low / Over).
 * Figma: Badge/round variants (Color=Optima/Over/Under/etc.)
 * Spec per variant (bg-50, border-200, text-700 of each utility color):
 *  - optimal → success
 *  - moderate → gray (neutral)
 *  - low → warning
 *  - over → warning (stronger) — Figma shows warning-50/200/700 for "Over"
 *  - under → error
 *  - bg + border + text-xs 12/18 medium, rounded-full, px-8 (md), py-[2px] (xxs)
 */
import { cn } from "@/lib/utils";

export type StatusTone = "optimal" | "moderate" | "low" | "over" | "under";

const TONE: Record<StatusTone, string> = {
  optimal: "bg-success-50 border-success-200 text-success-700",
  moderate: "bg-gray-100 border-gray-200 text-gray-700",
  low: "bg-warning-50 border-warning-200 text-warning-700",
  over: "bg-warning-50 border-warning-200 text-warning-700",
  under: "bg-error-50 border-error-200 text-error-700",
};

export function StatusPill({
  tone,
  children,
}: {
  tone: StatusTone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-md py-xxs",
        "text-xs font-medium whitespace-nowrap",
        TONE[tone],
      )}
    >
      {children}
    </span>
  );
}
