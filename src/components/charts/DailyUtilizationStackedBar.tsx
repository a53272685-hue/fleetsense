"use client";

/**
 * DailyUtilizationStackedBar — "Daily Utilization Status"
 * Figma: node 372:9122 "Stacked bar charts"
 * - 7 days (Jan 1-7), each bar split into 4 stacked categories (Inactive / Under / Optimal / Over)
 * - y-axis: 0%..100%, gridlines at 20% intervals
 * - colors match our utility palette
 */
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";

// Display name mapping: dataKey (lowercase) → Figma label.
const DISPLAY_NAME: Record<string, string> = {
  optimal: "Optimal",
  under: "Under-utilized",
  inactive: "Inactive",
  over: "Over-utilized",
};

/**
 * Custom tooltip content matching Figma "Tooltip / label" variant (node 19769:582):
 *  - black @ 80% opacity bg, radius-xs (4px), shadow-xs, 8px padding
 *  - top row: day label (text-xs medium, white)
 *  - one row per stack segment: 8px color swatch + label + right-aligned value
 *  - rows rendered in visual stack order (Over top → Optimal bottom)
 */
function DailyUtilTooltipContent(props: TooltipProps<number, string>) {
  // Recharts v3 no longer types `payload`/`label` on TooltipProps but still
  // passes them at runtime through the content callback. Read via cast.
  const { active, payload, label } = props as TooltipProps<number, string> & {
    payload?: Array<{ name?: string; value?: number; color?: string; dataKey?: string }>;
    label?: string;
  };
  if (!active || !payload || payload.length === 0) return null;
  // Recharts gives stack order bottom→top (optimal, under, inactive, over).
  // Reverse so the tooltip matches the visual stack (over on top).
  const rows = [...payload].reverse();
  return (
    <div
      style={{
        background: "rgba(0, 0, 0, 0.8)",
        borderRadius: 4,
        padding: 8,
        minWidth: 180,
        boxShadow: "0 1px 2px rgba(10, 13, 18, 0.05)",
        color: "#ffffff",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 12,
          lineHeight: "18px",
          fontWeight: 500,
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {rows.map((row) => {
          const key = String(row.dataKey ?? "");
          return (
            <div
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 32,
                fontSize: 12,
                lineHeight: "18px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: String(row.color),
                    display: "inline-block",
                  }}
                />
                <span style={{ fontWeight: 400 }}>
                  {DISPLAY_NAME[key] ?? key}
                </span>
              </div>
              <span style={{ fontWeight: 500 }}>{row.value}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export type StackDatum = {
  day: string;
  inactive: number;
  under: number;
  optimal: number;
  over: number;
};

const COLOR = {
  inactive: "var(--utility-gray-300)",
  under: "var(--utility-error-500)",
  optimal: "var(--utility-success-500)",
  over: "var(--utility-warning-500)",
};

export function DailyUtilizationStackedBar({ data }: { data: StackDatum[] }) {
  // Each segment gets full radius on all 4 corners (Figma).
  // A white stroke on every segment produces the visual gap between
  // adjacent stacked blocks because stroke is painted on both sides of
  // the edge — where two segments meet, the combined stroke looks like
  // a small gap on a white card background.
  // Mount animation: each segment grows from baseline (600ms, ease-out).
  const segmentProps = {
    stackId: "s",
    maxBarSize: 56,
    radius: 2 as const,
    stroke: "var(--bg-primary)",
    strokeWidth: 2,
    isAnimationActive: true,
    animationDuration: 600,
    animationEasing: "ease-out" as const,
  };

  return (
    <div className="h-[194px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          barCategoryGap="28%"
        >
          <CartesianGrid
            vertical={false}
            stroke="var(--border-secondary)"
            strokeDasharray="4 4"
          />
          <XAxis
            dataKey="day"
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
          {/* Figma cursor: pale brand tint vertical band behind hovered day */}
          <Tooltip
            cursor={{ fill: "var(--utility-brand-50)", opacity: 0.6 }}
            content={<DailyUtilTooltipContent />}
            wrapperStyle={{
              outline: "none",
              transition:
                "opacity var(--duration-fast) var(--ease-out-fast), transform var(--duration-fast) var(--ease-out-fast)",
            }}
          />
          {/* stacked from bottom to top: optimal → under → inactive → over.
              `name` overrides the dataKey in payload so category labels
              display properly (matched by DISPLAY_NAME in tooltip). */}
          <Bar
            dataKey="optimal"
            name="Optimal"
            fill={COLOR.optimal}
            {...segmentProps}
          />
          <Bar
            dataKey="under"
            name="Under-utilized"
            fill={COLOR.under}
            {...segmentProps}
          />
          <Bar
            dataKey="inactive"
            name="Inactive"
            fill={COLOR.inactive}
            {...segmentProps}
          />
          <Bar
            dataKey="over"
            name="Over-utilized"
            fill={COLOR.over}
            {...segmentProps}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
