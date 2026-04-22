"use client";

/**
 * FleetCompositionDonut — "Fleet Composition Status"
 * Figma: node 286:15856 "Pie chart" (196 × 196)
 * - 4 slices: Inactive / Under / Optimal / Over
 * - center label: "Total" (xs regular text-quaternary) + number (21.4/28.5 medium)
 */
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { chartTooltipStyle } from "./chartTooltipStyle";

export type CompositionDatum = {
  label: "Inactive" | "Under-Utilized" | "Optimal" | "Over-Utilized";
  value: number;
};

const SLICE_COLOR: Record<CompositionDatum["label"], string> = {
  Inactive: "var(--utility-gray-300)",
  "Under-Utilized": "var(--utility-error-500)",
  Optimal: "var(--utility-success-500)",
  "Over-Utilized": "var(--utility-warning-500)",
};

export function FleetCompositionDonut({
  data,
  total,
  size = 196,
}: {
  data: CompositionDatum[];
  total: number;
  size?: number;
}) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            {...chartTooltipStyle}
            formatter={((v: number, n: string) => [`${v} vehicles`, n]) as never}
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
            /* Recharts v3 bug: slices don't render with startAngle=90/endAngle=-270
               when isAnimationActive=true. Keep animation off to avoid disappearing slices. */
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
        </p>
      </div>
    </div>
  );
}
