/**
 * ProgressKpiCard — "Metric progress" card variant.
 * Figma: utilization/vehicle-deep-dive "Metric progress" (634×188).
 *
 * Layout:
 *  - Header: icon badge + title
 *  - Big value (display-sm bold)
 *  - ProgressBar (full width)
 *  - Footer: small trend badge + "vs last week"
 */
import type { ComponentType, SVGProps } from "react";
import { KpiIconBadge } from "./KpiIconBadge";
import { ProgressBar } from "./ProgressBar";
import { ArrowUpIcon, ArrowDownIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export type ProgressKpiCardProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  iconTone?: "brand" | "success" | "warning" | "error" | "gray";
  title: string;
  /** Big primary value, e.g. "44%" or "8/14" */
  value: string;
  /** 0–100 progress percentage — independent from the displayed value. */
  progressPct: number;
  /** Delta badge, e.g. { direction: "up", value: "100%" } */
  trend?: { direction: "up" | "down"; value: string };
  /** Tail text, default "vs last week". */
  compareLabel?: string;
};

export function ProgressKpiCard({
  icon,
  iconTone = "brand",
  title,
  value,
  progressPct,
  trend,
  compareLabel = "vs last week",
}: ProgressKpiCardProps) {
  return (
    <article
      className={cn(
        "flex flex-col gap-lg rounded-xl border border-border-secondary bg-bg-primary p-3xl shadow-xs",
        "transition-[transform,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out-fast)] will-change-transform",
        "hover:-translate-y-px hover:shadow-lg",
      )}
    >
      <header className="flex items-center gap-md">
        <KpiIconBadge icon={icon} tone={iconTone} />
        <p className="text-base font-medium leading-6 text-text-tertiary">
          {title}
        </p>
      </header>

      <p className="text-display-sm font-bold leading-[38px] text-text-primary">
        {value}
      </p>

      <ProgressBar value={progressPct} label={`${title} progress`} />

      {trend ? (
        <div className="flex items-center gap-sm text-sm">
          <span
            className={cn(
              "inline-flex items-center gap-xs font-medium",
              trend.direction === "up"
                ? "text-text-success-primary"
                : "text-text-error-primary",
            )}
          >
            {trend.direction === "up" ? (
              <ArrowUpIcon className="h-3 w-3" />
            ) : (
              <ArrowDownIcon className="h-3 w-3" />
            )}
            {trend.value}
          </span>
          <span className="text-text-tertiary">{compareLabel}</span>
        </div>
      ) : null}
    </article>
  );
}
