"use client";

/**
 * TimeBreakdownDonut — Pie chart for driver/vehicle time split.
 * Figma: "Time Breakdown" card on /utilization/vehicle-deep-dive and
 * /efficiency/driver-deep-dive (uses Driving/Idling/Stopped/PTO categories).
 *
 * Unlike FleetCompositionDonut (which uses success/warning/error/gray for
 * vehicle utilization categories), this variant uses a brand-blue-dominant
 * palette so "Driving" — the largest slice in real data — reads as the
 * positive primary state. Matches Figma's blue-heavy donut mock.
 */
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { chartTooltipStyle } from "./chartTooltipStyle";

export type TimeBreakdownCategory =
  | "Driving"
  | "Idling"
  | "Stopped"
  | "PTO";

export type TimeBreakdownDatum = {
  label: TimeBreakdownCategory;
  value: number;
};

/** Figma palette: Driving brand-blue · Idling warning · Stopped error · PTO gray. */
const SLICE_COLOR: Record<TimeBreakdownCategory, string> = {
  Driving: "var(--utility-brand-500)",
  Idling: "var(--utility-warning-500)",
  Stopped: "var(--utility-error-500)",
  PTO: "var(--utility-gray-300)",
};

export function TimeBreakdownDonut({
  data,
  total,
  totalUnit = "h",
  size = 196,
}: {
  data: TimeBreakdownDatum[];
  total: number;
  /** Shown next to total as a small unit suffix. Defaults to "h". */
  totalUnit?: string;
  size?: number;
}) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            {...chartTooltipStyle}
            formatter={(v: number, n: string) => [`${v}${totalUnit}`, n]}
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius={size * 0.32}
            outerRadius={size * 0.5}
            paddingAngle={0}
            startAngle={90}
            endAngle={-270}
            stroke="transparent"
            // Recharts v3 bug — animation drops slices with startAngle=90.
            isAnimationActive={false}
          >
            {data.map((d) => (
              <Cell key={d.label} fill={SLICE_COLOR[d.label]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-xs font-normal text-text-quaternary">Total</p>
        <p
          className="font-medium text-text-primary"
          style={{ fontSize: "21.4px", lineHeight: "28.5px" }}
        >
          {total}
          {totalUnit ? (
            <span className="text-sm text-text-tertiary">{totalUnit}</span>
          ) : null}
        </p>
      </div>
    </div>
  );
}
