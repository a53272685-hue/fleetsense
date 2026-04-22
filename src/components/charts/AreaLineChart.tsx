"use client";

/**
 * AreaLineChart — line chart with soft gradient area fill.
 * Figma: "Area Chart" instances on utilization/activity (286:14856, 286:14861).
 *
 * Spec observed:
 *  - y-axis: 0-2500 default (overrideable), 6 ticks
 *  - x-axis: first + last date labels only (e.g. "Jan 1" ... "Jan 14")
 *  - area: brand blue gradient, top ~40% opacity → bottom ~0
 *  - line: brand-500 stroke 2px on top
 *  - horizontal gridlines dashed (border-secondary)
 *
 * Interactions:
 *  - Mount: area draws in (Recharts default 600ms)
 *  - Hover: dark tooltip (shared Figma spec) + vertical cursor line
 *  - prefers-reduced-motion honored via global CSS rule
 */
import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { chartTooltipStyle } from "./chartTooltipStyle";

export type AreaLineDatum = {
  /** e.g. "Jan 1" */
  label: string;
  value: number;
};

export function AreaLineChart({
  data,
  yDomain,
  yTicks,
  height = 194,
  gradientId,
  valueSuffix,
}: {
  data: AreaLineDatum[];
  /** Tuple or `"auto"`. Defaults to [0, 2500]. */
  yDomain?: [number, number];
  yTicks?: number[];
  height?: number;
  /** Unique gradient id so two charts on the same page don't collide. */
  gradientId: string;
  /** Appended to tooltip value, e.g. " mi". */
  valueSuffix?: string;
}) {
  const domain = yDomain ?? [0, 2500];
  const ticks = yTicks ?? [0, 500, 1000, 1500, 2000, 2500];
  const first = data[0]?.label;
  const last = data[data.length - 1]?.label;

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--utility-brand-500)"
                stopOpacity={0.28}
              />
              <stop
                offset="100%"
                stopColor="var(--utility-brand-500)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
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
            // Only show first and last tick to match Figma.
            ticks={first && last ? [first, last] : undefined}
            interval="preserveStartEnd"
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
            domain={domain}
            ticks={ticks}
            width={48}
          />
          <Tooltip
            cursor={{
              stroke: "var(--utility-brand-500)",
              strokeWidth: 1,
              strokeDasharray: "4 4",
            }}
            {...chartTooltipStyle}
            formatter={(v: number) => [
              `${v.toLocaleString()}${valueSuffix ?? ""}`,
              undefined,
            ]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--utility-brand-500)"
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            // Mount animation: 600ms ease-out (matches other charts).
            isAnimationActive
            animationDuration={600}
            animationEasing="ease-out"
            // Dot shown on hover only (default Recharts behavior).
            activeDot={{
              r: 4,
              stroke: "var(--utility-brand-500)",
              strokeWidth: 2,
              fill: "var(--bg-primary)",
            }}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
