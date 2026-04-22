"use client";

/**
 * UtilizationColumnChart — "Asset Density by Score"
 * Figma: node 278:15170 "Column Chart"
 */
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { chartTooltipStyle } from "./chartTooltipStyle";

export type ColumnDatum = {
  bucket: string;
  value: number;
  category: "inactive" | "under" | "optimal" | "over";
};

const CATEGORY_COLOR: Record<ColumnDatum["category"], string> = {
  inactive: "var(--utility-gray-300)",
  under: "var(--utility-error-500)",
  optimal: "var(--utility-success-500)",
  over: "var(--utility-warning-500)",
};

export function UtilizationColumnChart({
  data,
  average,
}: {
  data: ColumnDatum[];
  average?: number;
}) {
  return (
    <div className="h-[194px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          {/* default 20% gridlines */}
          <CartesianGrid
            vertical={false}
            stroke="var(--border-secondary)"
            strokeDasharray="4 4"
          />
          {/* average line — drawn on same grid layer (z-index -100) so it sits
              BEHIND the bars (which are at layer 300). Using horizontalValues
              pins the dashed line exactly at the average data value. */}
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
            dataKey="bucket"
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
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            tickFormatter={(v) => `${v}%`}
            width={48}
          />
          <Tooltip
            cursor={{ fill: "var(--utility-gray-100)", opacity: 0.5 }}
            {...chartTooltipStyle}
            formatter={(v: number) => [`${v}%`, "Assets"]}
          />
          {/* Figma spec: rounded top corners only (~4px).
              Mount animation: bars grow from baseline (600ms, ease-out). */}
          <Bar
            dataKey="value"
            maxBarSize={26}
            radius={[4, 4, 0, 0]}
            isAnimationActive
            animationDuration={600}
            animationEasing="ease-out"
          >
            {data.map((d) => (
              <Cell key={d.bucket} fill={CATEGORY_COLOR[d.category]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
