/**
 * GapKpiCard — KPI card showing the gap between two groups.
 * Figma: utilization/group-comparison top 3 cards.
 *
 * Layout:
 *  - Header: icon badge + title + dots
 *  - Big gap value (e.g. "+18%") + trend badge
 *  - 2 comparison rows, each: label + horizontal bar + value
 *    (bars use distinct colors — brand for "your group", purple for "other")
 */
import type { ComponentType, SVGProps } from "react";
import { DotsVerticalIcon } from "@/components/icons";
import { KpiIconBadge } from "./KpiIconBadge";
import { Badge } from "./Badge";
import { cn } from "@/lib/utils";

export type GapCompareRow = {
  label: string;
  /** 0-100 percentage for the bar width. */
  pct: number;
  /** Display value on the right (e.g. "78%", "1.3h", "6"). */
  value: string;
  /** CSS color reference. */
  color: string;
};

export type GapKpiCardProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  iconTone?: "brand" | "success" | "warning" | "error" | "gray";
  title: string;
  /** Big gap value, e.g. "+18%" or "+0.2h" */
  gap: string;
  trend?: { direction: "up" | "down"; value: string };
  rows: [GapCompareRow, GapCompareRow];
};

export function GapKpiCard({
  icon,
  iconTone = "brand",
  title,
  gap,
  trend,
  rows,
}: GapKpiCardProps) {
  return (
    <article
      className={cn(
        "flex flex-col gap-xl rounded-xl border border-border-secondary bg-bg-primary p-3xl shadow-xs",
        "transition-[transform,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out-fast)]",
        "hover:-translate-y-px hover:shadow-lg",
      )}
    >
      <header className="flex items-center gap-md">
        <KpiIconBadge icon={icon} tone={iconTone} />
        <p className="min-w-0 flex-1 text-base font-medium leading-6 text-text-tertiary">
          {title}
        </p>
        <button
          type="button"
          aria-label={`${title} options`}
          className="text-fg-quaternary transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-fast)] hover:text-fg-quaternary-hover"
        >
          <DotsVerticalIcon className="h-5 w-5" />
        </button>
      </header>

      <div className="flex items-center gap-md">
        <p className="text-display-sm font-bold leading-[38px] text-text-primary">
          {gap}
        </p>
        {trend ? <Badge trend={trend.direction}>{trend.value}</Badge> : null}
      </div>

      <div className="flex flex-col gap-md">
        {rows.map((r) => (
          <div
            key={r.label}
            className="grid grid-cols-[64px_1fr_auto] items-center gap-md"
          >
            <span className="text-sm text-text-tertiary">{r.label}</span>
            <div className="h-2 rounded-full bg-bg-secondary">
              <div
                className="h-full rounded-full transition-[width] duration-[var(--duration-slow)] ease-[var(--ease-out-standard)]"
                style={{
                  width: `${Math.min(100, Math.max(0, r.pct))}%`,
                  backgroundColor: r.color,
                }}
              />
            </div>
            <span className="text-sm font-medium text-text-secondary">
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}
