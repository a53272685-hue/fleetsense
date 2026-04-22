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
  /** Direction drives the arrow; tone (optional) drives the badge color
      so metrics where "up" is bad (e.g. Idle Time) can stay red. */
  trend?: {
    direction: "up" | "down";
    value: string;
    tone?: "success" | "error";
  };
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
        // Figma spec: p-3xl (24), gap-4xl (32) between the 3 sections.
        "flex flex-col gap-4xl rounded-xl border border-border-secondary bg-bg-primary p-3xl shadow-xs",
        "transition-[transform,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out-fast)]",
        "hover:-translate-y-px hover:shadow-lg",
      )}
    >
      {/* 1. Heading row — icon + title + dots */}
      <header className="flex items-center gap-lg">
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

      {/* 2. Value row — big gap value + trend badge */}
      <div className="flex items-center justify-between gap-md">
        <p className="text-display-sm font-bold leading-[38px] text-text-primary">
          {gap}
        </p>
        {trend ? (
          <Badge trend={trend.direction} tone={trend.tone}>
            {trend.value}
          </Badge>
        ) : null}
      </div>

      {/* 3. Compare rows — label 60px + bar (flex-1) + value 40px right. */}
      <div className="flex flex-col gap-lg">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between gap-md"
          >
            <span className="w-[60px] shrink-0 truncate text-sm font-medium text-text-tertiary">
              {r.label}
            </span>
            {/* Figma spec: 20px tall bar. Fill radius is 0 / 4px / 0 / 4px
                (right corners only) per Figma Appearance panel — left edge
                stays square, right end rounds at 4px. Track keeps rounded-full
                so the pill-shaped left start is visible through the fill's
                square left corners (clipped by overflow-hidden). */}
            <div className="h-[20px] flex-1 overflow-hidden rounded-full bg-bg-secondary">
              <div
                className="h-full rounded-r-[4px] transition-[width] duration-[var(--duration-slow)] ease-[var(--ease-out-standard)]"
                style={{
                  width: `${Math.min(100, Math.max(0, r.pct))}%`,
                  backgroundColor: r.color,
                }}
              />
            </div>
            <span className="w-[40px] shrink-0 text-right text-sm font-semibold text-text-secondary">
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}
