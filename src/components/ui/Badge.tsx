/**
 * Badge — trend badge (e.g. "↑ 5.2%") used in KPI cards.
 * Figma: Badge/rectangle/lg variant
 * Spec:
 *  - success: bg-success-50 (#ecfdf3), border success-200 (#abefc6), text success-700 (#067647)
 *  - error:   bg-error-50,  border error-200, text error-700
 *  - padding: pl-8 pr-10 py-4
 *  - radius: 8px (md)
 *  - gap: 4px (xs)
 *  - icon 12×12, text sm 14/20 medium
 */
import type { ReactNode } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export type BadgeProps = {
  trend: "up" | "down";
  tone?: "success" | "error";
  children: ReactNode;
};

export function Badge({ trend, tone = trend === "up" ? "success" : "error", children }: BadgeProps) {
  const Icon = trend === "up" ? ArrowUpIcon : ArrowDownIcon;
  const toneClasses =
    tone === "success"
      ? "bg-success-50 border-success-200 text-success-700"
      : "bg-error-50 border-error-200 text-error-700";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-xs",
        "pl-md pr-[10px] py-xs",
        "rounded-md border",
        "text-sm font-medium",
        toneClasses,
      )}
    >
      <Icon className="h-3 w-3" />
      {children}
    </span>
  );
}
