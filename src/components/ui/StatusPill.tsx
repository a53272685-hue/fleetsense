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

export type StatusTone =
  | "optimal"
  | "moderate"
  | "low"
  | "over"
  | "under"
  // Compliance-specific tones for risk levels, violation types, and severity
  | "risk-high"
  | "risk-medium"
  | "risk-low"
  | "level-1"
  | "level-2"
  | "level-3"
  | "crash"
  | "hos"
  | "vehicle"
  | "driver"
  | "hazmat"
  | "brand"
  // Form submission status/type pills
  | "pending"
  | "in-review"
  | "approved"
  | "flagged"
  | "resolved"
  | "new"
  | "coaching"
  | "fuel"
  | "inspection"
  | "trip"
  | "safety"
  | "maintenance"
  | "manual"
  | "mobile"
  | "auto"
  // Due-date urgency / time-to-due
  | "due-urgent"
  | "due-soon";

const TONE: Record<StatusTone, string> = {
  optimal: "bg-success-50 border-success-200 text-success-700",
  moderate: "bg-gray-100 border-gray-200 text-gray-700",
  low: "bg-warning-50 border-warning-200 text-warning-700",
  over: "bg-warning-50 border-warning-200 text-warning-700",
  under: "bg-error-50 border-error-200 text-error-700",

  // Risk levels
  "risk-high": "bg-error-50 border-error-200 text-error-700",
  "risk-medium": "bg-warning-50 border-warning-200 text-warning-700",
  "risk-low": "bg-success-50 border-success-200 text-success-700",

  // CSA inspection levels
  "level-1": "bg-gray-100 border-gray-200 text-gray-700",
  "level-2": "bg-warning-50 border-warning-200 text-warning-700",
  "level-3": "bg-error-50 border-error-200 text-error-700",

  // CSA violation categories
  crash: "bg-error-50 border-error-200 text-error-700",
  hos: "bg-warning-50 border-warning-200 text-warning-700",
  vehicle: "bg-[var(--utility-brand-50)] border-[var(--utility-brand-200)] text-[var(--utility-brand-700)]",
  driver: "bg-[var(--utility-purple-50)] border-[var(--utility-purple-200)] text-[var(--utility-purple-700)]",
  hazmat: "bg-[var(--utility-purple-50)] border-[var(--utility-purple-200)] text-[var(--utility-purple-700)]",
  brand: "bg-[var(--utility-brand-50)] border-[var(--utility-brand-200)] text-[var(--utility-brand-700)]",

  // Form submission status
  pending: "bg-warning-50 border-warning-200 text-warning-700",
  "in-review": "bg-[var(--utility-brand-50)] border-[var(--utility-brand-200)] text-[var(--utility-brand-700)]",
  approved: "bg-success-50 border-success-200 text-success-700",
  flagged: "bg-error-50 border-error-200 text-error-700",
  resolved: "bg-gray-100 border-gray-200 text-gray-700",
  new: "bg-[var(--utility-brand-50)] border-[var(--utility-brand-200)] text-[var(--utility-brand-700)]",
  coaching: "bg-[var(--utility-purple-50)] border-[var(--utility-purple-200)] text-[var(--utility-purple-700)]",

  // Form type pills
  fuel: "bg-error-50 border-error-200 text-error-700",
  inspection: "bg-[var(--utility-brand-50)] border-[var(--utility-brand-200)] text-[var(--utility-brand-700)]",
  trip: "bg-gray-100 border-gray-200 text-gray-700",
  safety: "bg-error-50 border-error-200 text-error-700",
  maintenance: "bg-warning-50 border-warning-200 text-warning-700",

  // Source pills
  manual: "bg-gray-100 border-gray-200 text-gray-700",
  mobile: "bg-gray-100 border-gray-200 text-gray-700",
  auto: "bg-gray-100 border-gray-200 text-gray-700",

  // Urgency
  "due-urgent": "bg-error-50 border-error-200 text-error-700",
  "due-soon": "bg-warning-50 border-warning-200 text-warning-700",
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
