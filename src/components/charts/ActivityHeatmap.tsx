"use client";

/**
 * ActivityHeatmap — 7-day × 24-hour activity density grid.
 * Figma: Heatmap component (node 2223:12599), used in utilization/activity.
 *
 * Spec (measured from Figma):
 *  - Y-axis column (26px): Mon/Tue/Wed/Thu/Fri/Sat/Sun (Text xs regular, text-tertiary)
 *  - Main grid: 7 rows × 24 columns, each cell ~46×25px
 *  - Cell gap: 4px (both axes)
 *  - Cell radius: 4px
 *  - Density color ramp (0..4):
 *     0 → utility-gray-100   (#eff1f5)  — no activity
 *     1 → utility-brand-100  (#d1e9ff)  — low
 *     2 → utility-brand-300  (#84caff)  — medium
 *     3 → utility-brand-500  (#2e90fa)  — high
 *     4 → utility-brand-700  (#175cd3)  — very high
 *
 * The grid uses CSS `grid-template-columns: repeat(24, 1fr)` so cells
 * distribute evenly to fill the container width regardless of wrap size.
 */
import { cn } from "@/lib/utils";

/** Density level 0–4. */
export type HeatmapDensity = 0 | 1 | 2 | 3 | 4;

/** Matrix: rows = days (Mon→Sun), columns = hours 00→23. */
export type HeatmapMatrix = HeatmapDensity[][];

/** Color family for the 5-level density ramp. */
export type HeatmapPalette = "brand" | "purple";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const HOUR_LABELS = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, "0"),
);

const DENSITY_BG: Record<HeatmapPalette, Record<HeatmapDensity, string>> = {
  brand: {
    0: "bg-[var(--utility-gray-100)]",
    1: "bg-[var(--utility-brand-100)]",
    2: "bg-[var(--utility-brand-300)]",
    3: "bg-[var(--utility-brand-500)]",
    4: "bg-[var(--utility-brand-700)]",
  },
  purple: {
    0: "bg-[var(--utility-gray-100)]",
    1: "bg-[var(--utility-purple-100)]",
    2: "bg-[var(--utility-purple-300)]",
    3: "bg-[var(--utility-purple-500)]",
    4: "bg-[var(--utility-purple-700)]",
  },
};

export function ActivityHeatmap({
  matrix,
  palette = "brand",
}: {
  matrix: HeatmapMatrix;
  palette?: HeatmapPalette;
}) {
  if (matrix.length !== 7) {
    console.warn(
      `ActivityHeatmap: expected 7 day rows, got ${matrix.length}.`,
    );
  }
  const ramp = DENSITY_BG[palette];
  return (
    <div className="flex w-full items-start gap-md">
      {/* Y-axis labels (days) — 26px wide per Figma */}
      <div
        className="flex shrink-0 flex-col gap-[4px] pt-[22px] text-right text-xs text-text-tertiary"
        style={{ width: 26 }}
      >
        {DAY_LABELS.map((d) => (
          <div key={d} style={{ height: 25 }} className="flex items-center justify-end">
            {d}
          </div>
        ))}
      </div>

      {/* Main grid: top hour axis + 7 rows */}
      <div className="flex min-w-0 flex-1 flex-col gap-md">
        {/* X-axis (hours) */}
        <div
          className="grid text-center text-xs text-text-tertiary"
          style={{
            gridTemplateColumns: "repeat(24, minmax(0, 1fr))",
            gap: 4,
          }}
        >
          {HOUR_LABELS.map((h) => (
            <div key={h}>{h}</div>
          ))}
        </div>

        {/* 7-row grid */}
        <div className="flex flex-col gap-[4px]">
          {matrix.slice(0, 7).map((row, rowIdx) => (
            <div
              key={DAY_LABELS[rowIdx]}
              className="grid"
              style={{
                gridTemplateColumns: "repeat(24, minmax(0, 1fr))",
                gap: 4,
              }}
              aria-label={`${DAY_LABELS[rowIdx]} activity`}
            >
              {row.map((density, hourIdx) => (
                <div
                  key={hourIdx}
                  aria-label={`${DAY_LABELS[rowIdx]} ${HOUR_LABELS[hourIdx]}:00 density ${density}`}
                  className={cn(
                    "h-[25px] rounded-xs",
                    ramp[density] ?? ramp[0],
                    "transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out-fast)]",
                    "hover:scale-105",
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * HeatmapLegend — "Density Low [□□■■■] High" strip used above the heatmap.
 * Figma node 286:12148.
 */
export function HeatmapLegend({
  palette = "brand",
}: {
  palette?: HeatmapPalette;
}) {
  const levels: HeatmapDensity[] = [0, 1, 2, 3, 4];
  const ramp = DENSITY_BG[palette];
  return (
    <div className="flex items-center gap-md text-xs text-text-tertiary">
      <span className="font-medium">Density</span>
      <span>Low</span>
      <div className="flex items-center gap-[2px]">
        {levels.map((l) => (
          <div
            key={l}
            className={cn("h-[16px] w-[16px] rounded-xs", ramp[l])}
          />
        ))}
      </div>
      <span>High</span>
    </div>
  );
}
