"use client";

/**
 * GroupedColumnChart — side-by-side 2-series column chart.
 * Figma: utilization/group-comparison "Daily Utilization Status" chart.
 *
 * For each x-axis bucket (e.g. Jan 1), two colored bars sit next to each
 * other representing the two groups. Optional average reference line uses
 * the same "grid-layer" trick from UtilizationColumnChart so it paints
 * behind the bars.
 */
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { chartTooltipStyle } from "./chartTooltipStyle";

export type GroupedColumnDatum = {
  label: string;
  [seriesKey: string]: string | number;
};

export type GroupedSeries = {
  key: string;
  name: string;
  color: string;
};

export function GroupedColumnChart({
  data,
  series,
  yDomain = [0, 100],
  yTicks = [0, 20, 40, 60, 80, 100],
  average,
  height = 240,
}: {
  data: GroupedColumnDatum[];
  /** Exactly 2 series. */
  series: [GroupedSeries, GroupedSeries];
  yDomain?: [number, number];
  yTicks?: number[];
  /** Optional dashed brand-colored horizontal line value (drawn behind bars). */
  average?: number;
  height?: number;
}) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
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
          {/* Average line — uses horizontalValues so it lands on the grid
              layer (behind bars). Matches UtilizationColumnChart pattern. */}
          {typeof average === "number" ? (
            <CartesianGrid
              vertical={false}
              horizontalValues={[average]}
              stroke="var(--fg-brand-primary)"
              strokeDasharray="6 4"
              strokeWidth={1.5}
            />
          ) : null}
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
            tickFormatter={(v) => `${v}%`}
            width={48}
          />
          <Tooltip
            cursor={{ fill: "var(--utility-brand-50)", opacity: 0.5 }}
            {...chartTooltipStyle}
          />
          {series.map((s) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.name}
              fill={s.color}
              maxBarSize={32}
              radius={[4, 4, 0, 0]}
              isAnimationActive
              animationDuration={600}
              animationEasing="ease-out"
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
