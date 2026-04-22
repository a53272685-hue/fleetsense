"use client";

/**
 * DefectsStackedBar — 3-category stacked bar (Critical / Major / Minor).
 * Figma: "Reported Defects" card on /compliance/maintenance.
 *
 * Each day splits into three stacked segments bottom→top:
 *  - Minor (Nice) → gray (utility-gray-300)
 *  - Major → warning (utility-warning-500)
 *  - Critical → error (utility-error-500)
 *
 * Each segment has all-corner radius + white stroke for the small gap
 * effect between stacked blocks (same trick as DailyUtilizationStackedBar).
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

export type DefectsDatum = {
  day: string;
  critical: number;
  major: number;
  minor: number;
};

const COLOR = {
  critical: "var(--utility-error-500)",
  major: "var(--utility-warning-500)",
  minor: "var(--utility-gray-300)",
} as const;

const DISPLAY_NAME: Record<string, string> = {
  critical: "Critical",
  major: "Major",
  minor: "Minor",
};

function TooltipContent({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;
  // Tooltip order: Critical → Major → Minor (visual stack top → bottom).
  const rows = [...payload].reverse();
  return (
    <div
      style={{
        background: "rgba(0, 0, 0, 0.8)",
        borderRadius: 4,
        padding: 8,
        minWidth: 140,
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
                gap: 24,
                fontSize: 12,
                lineHeight: "18px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                <span>{DISPLAY_NAME[key] ?? key}</span>
              </div>
              <span style={{ fontWeight: 500 }}>{row.value}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DefectsStackedBar({ data }: { data: DefectsDatum[] }) {
  const segmentProps = {
    stackId: "d",
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
          <Tooltip
            cursor={{ fill: "var(--utility-brand-50)", opacity: 0.6 }}
            content={<TooltipContent />}
            wrapperStyle={{
              outline: "none",
              transition:
                "opacity var(--duration-fast) var(--ease-out-fast), transform var(--duration-fast) var(--ease-out-fast)",
            }}
          />
          {/* Stacked bottom→top: minor → major → critical (Figma visual). */}
          <Bar dataKey="minor" name="Minor" fill={COLOR.minor} {...segmentProps} />
          <Bar dataKey="major" name="Major" fill={COLOR.major} {...segmentProps} />
          <Bar
            dataKey="critical"
            name="Critical"
            fill={COLOR.critical}
            {...segmentProps}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
