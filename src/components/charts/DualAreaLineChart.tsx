"use client";

/**
 * DualAreaLineChart — stacked / overlapping 2-series area chart.
 * Figma: "Performance Trends" card on /utilization/vehicle-deep-dive.
 *
 * Series rendered in order — first series in the back, second in front.
 * Each series has its own gradient fill + line stroke, and shows a dot
 * marker at the right end legend block via ChartLegend.
 *
 * Reuses the same Figma dark tooltip styling.
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

export type DualSeriesDatum = {
  label: string;
  [seriesKey: string]: string | number;
};

export type DualSeries = {
  /** Data key present in every datum. */
  key: string;
  /** Display name shown in tooltip/legend. */
  name: string;
  /** Stroke/line color (CSS variable reference). */
  color: string;
  /** Gradient fill id prefix (full id = `${idPrefix}-${key}`). */
};

export function DualAreaLineChart({
  data,
  series,
  yDomain,
  yTicks,
  height = 194,
  gradientIdPrefix,
}: {
  data: DualSeriesDatum[];
  /** Exactly two series, ordered back → front. */
  series: [DualSeries, DualSeries];
  yDomain?: [number, number];
  yTicks?: number[];
  height?: number;
  /** Unique id prefix so two instances on the same page don't clash. */
  gradientIdPrefix: string;
}) {
  const domain = yDomain ?? [0, 150];
  const ticks = yTicks ?? [0, 30, 60, 90, 120, 150];
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
            {series.map((s) => (
              <linearGradient
                key={s.key}
                id={`${gradientIdPrefix}-${s.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={s.color} stopOpacity={0.28} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
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
          />
          {series.map((s) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={2}
              fill={`url(#${gradientIdPrefix}-${s.key})`}
              isAnimationActive
              animationDuration={600}
              animationEasing="ease-out"
              activeDot={{
                r: 4,
                stroke: s.color,
                strokeWidth: 2,
                fill: "var(--bg-primary)",
              }}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
