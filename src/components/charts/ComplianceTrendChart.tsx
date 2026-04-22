"use client";

/**
 * ComplianceTrendChart — grouped columns + line overlay.
 * Figma: /compliance/overview "Compliance Trend" card.
 *
 * Renders:
 *   - Blue bars (HOS Violations)
 *   - Purple bars (Defects)
 *   - Gray line overlay (Unassigned × 10)
 *
 * Uses Recharts ComposedChart so bars and line share the same axis system.
 */
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { chartTooltipStyle } from "./chartTooltipStyle";

export type ComplianceTrendDatum = {
  label: string;
  hos: number;
  defects: number;
  /** Already pre-multiplied by 10 for visibility (Figma legend says "x10"). */
  unassigned: number;
};

export function ComplianceTrendChart({
  data,
  yDomain = [0, 10],
  yTicks = [0, 2, 4, 6, 8, 10],
  height = 260,
}: {
  data: ComplianceTrendDatum[];
  yDomain?: [number, number];
  yTicks?: number[];
  height?: number;
}) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          barCategoryGap="20%"
          barGap={4}
        >
          <CartesianGrid
            vertical={false}
            stroke="var(--border-secondary)"
            strokeDasharray="4 4"
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={{ stroke: "var(--border-secondary)" }}
            tick={{
              fill: "var(--text-tertiary)",
              fontSize: 14,
              fontFamily: "Inter, system-ui, sans-serif",
            }}
            height={28}
          />
          <YAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tick={{
              fill: "var(--text-tertiary)",
              fontSize: 14,
              fontFamily: "Inter, system-ui, sans-serif",
            }}
            domain={yDomain}
            ticks={yTicks}
            width={48}
          />
          <Tooltip
            cursor={{ fill: "var(--utility-brand-50)", opacity: 0.5 }}
            {...chartTooltipStyle}
          />
          <Bar
            dataKey="hos"
            name="HOS Violations"
            fill="var(--utility-brand-500)"
            maxBarSize={28}
            radius={[4, 4, 0, 0]}
            isAnimationActive
            animationDuration={600}
            animationEasing="ease-out"
          />
          <Bar
            dataKey="defects"
            name="Defects"
            fill="var(--utility-purple-500)"
            maxBarSize={28}
            radius={[4, 4, 0, 0]}
            isAnimationActive
            animationDuration={600}
            animationEasing="ease-out"
          />
          {/* Smooth gray line overlay — Figma "Unassigned (x10)". */}
          <Line
            type="monotone"
            dataKey="unassigned"
            name="Unassigned (x10)"
            stroke="var(--utility-gray-500)"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
              stroke: "var(--utility-gray-500)",
              strokeWidth: 2,
              fill: "var(--bg-primary)",
            }}
            isAnimationActive
            animationDuration={600}
            animationEasing="ease-out"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
