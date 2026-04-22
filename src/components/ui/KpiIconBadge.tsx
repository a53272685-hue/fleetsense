/**
 * KpiIconBadge — 38x38 rounded square with brand-colored background + icon inside.
 * Figma: "KPI icon sm" instance, rounded 4.421px, bg brand-50 (#eff8ff).
 */
import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/utils";

export type KpiIconBadgeProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** Tone matches one of our @theme color palettes. Default: brand. */
  tone?: "brand" | "success" | "warning" | "error" | "gray";
};

const toneMap: Record<NonNullable<KpiIconBadgeProps["tone"]>, string> = {
  brand: "bg-brand-50 text-brand-600",
  success: "bg-success-50 text-success-600",
  warning: "bg-warning-50 text-warning-600",
  error: "bg-error-50 text-error-600",
  gray: "bg-gray-100 text-gray-500",
};

export function KpiIconBadge({ icon: Icon, tone = "brand" }: KpiIconBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center",
        "h-[38px] w-[38px] rounded-[4.421px]",
        toneMap[tone],
      )}
    >
      <Icon className="h-full w-full" />
    </div>
  );
}
