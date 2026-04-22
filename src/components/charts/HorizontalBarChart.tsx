"use client";

/**
 * HorizontalBarChart — bar-per-row with progress bar + value + optional badge.
 * Figma: "Violation Severity Weight" card on /compliance/csa (370:7923).
 *
 * Each row renders:
 *   [ label ..... ▓▓▓▓░░░░░░  71.2%  (5) ]
 *
 * Pure CSS — no Recharts needed for this layout. Each bar fills according to
 * `pct` (0–100) and animates from 0 on mount via `fs-animate-enter`-style
 * transition on width.
 */
import { cn } from "@/lib/utils";

export type HorizontalBarDatum = {
  label: string;
  /** 0–100 */
  pct: number;
  /** Display value text, e.g. "71.2%". */
  valueText?: string;
  /** Optional small trailing badge (count or tag). */
  trailing?: string;
};

export function HorizontalBarChart({
  data,
  color = "var(--utility-brand-500)",
}: {
  data: HorizontalBarDatum[];
  color?: string;
}) {
  return (
    <ul className="flex flex-col gap-lg">
      {data.map((d) => (
        <li
          key={d.label}
          className="grid grid-cols-[150px_1fr_56px_32px] items-center gap-md text-sm"
        >
          <span className="truncate text-text-secondary">{d.label}</span>
          <div className="h-2 rounded-full bg-bg-secondary">
            <div
              className={cn(
                "h-full rounded-full",
                "transition-[width] duration-[var(--duration-slow)] ease-[var(--ease-out-standard)]",
              )}
              style={{
                width: `${Math.min(100, Math.max(0, d.pct))}%`,
                backgroundColor: color,
              }}
            />
          </div>
          <span className="text-right font-medium text-text-primary">
            {d.valueText ?? `${d.pct.toFixed(1)}%`}
          </span>
          <span className="text-right text-text-tertiary">{d.trailing ?? ""}</span>
        </li>
      ))}
    </ul>
  );
}
