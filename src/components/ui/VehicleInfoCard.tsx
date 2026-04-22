"use client";

/**
 * VehicleInfoCard — big banner card at top of /utilization/vehicle-deep-dive/[id].
 * Figma: "Large tabs" frame (273:7066, 1280×257).
 *
 * Structure:
 *  - Top row: title + subtitle (breadcrumb-style metadata) + vehicle selector dropdown
 *  - Divider
 *  - 4 inline "tab" cells (Total Miles / Trips / Engine Hours / Fuel Used)
 *    each showing a heading + big number + trend badge
 */
import type { ReactNode } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { Badge } from "./Badge";

export type VehicleInlineKpi = {
  label: string;
  value: string;
  trend?: { direction: "up" | "down"; value: string };
};

export type VehicleInfoCardProps = {
  title: string;
  /** Breadcrumb-style subtitle, e.g. "2026 Unknown Unknown · 2TBNBRC30000000 · GroupA" */
  subtitle: string;
  /** Currently selected vehicle label shown in the dropdown trigger. */
  selectedLabel: string;
  kpis: VehicleInlineKpi[];
  /** Optional right-aligned extra content above the divider. */
  headerExtra?: ReactNode;
};

export function VehicleInfoCard({
  title,
  subtitle,
  selectedLabel,
  kpis,
  headerExtra,
}: VehicleInfoCardProps) {
  return (
    <section className="flex flex-col rounded-xl border border-border-secondary bg-bg-primary px-3xl py-2xl shadow-xs">
      {/* Top row: heading + selector */}
      <div className="flex items-start justify-between gap-xl">
        <div className="flex min-w-0 flex-col gap-xs">
          <h2 className="text-2xl font-semibold leading-[32px] text-text-primary">
            {title}
          </h2>
          <p className="text-base leading-6 text-text-tertiary">{subtitle}</p>
        </div>
        <div className="flex items-center gap-lg">
          {headerExtra}
          <button
            type="button"
            className="inline-flex h-10 min-w-[240px] items-center justify-between gap-md rounded-md border border-border-secondary bg-bg-primary px-[14px] text-sm font-medium text-text-secondary shadow-xs transition-[background-color] duration-[var(--duration-fast)] ease-[var(--ease-out-fast)] hover:bg-bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg-brand-primary"
            aria-haspopup="listbox"
          >
            <span>{selectedLabel}</span>
            <ChevronDownIcon className="h-4 w-4 text-fg-quaternary" />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-2xl h-px w-full bg-border-secondary" />

      {/* Inline KPI grid */}
      <div className="mt-2xl grid grid-cols-4 gap-xl">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="flex flex-col gap-md">
            <p className="text-base font-medium leading-6 text-text-tertiary">
              {kpi.label}
            </p>
            <div className="flex items-center gap-md">
              <p className="text-display-sm font-bold leading-[38px] text-text-primary">
                {kpi.value}
              </p>
              {kpi.trend ? (
                <Badge trend={kpi.trend.direction}>{kpi.trend.value}</Badge>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
