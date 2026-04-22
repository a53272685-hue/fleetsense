/**
 * ZoneActivityList — vertical list of zones with label, ProgressBar, and percentage.
 * Figma: utilization/activity "Zone Activity Distribution" (node 273:6676).
 *
 * Structure per row:
 *  - Label (Inter 14 medium, text-primary)
 *  - ProgressBar (brand)
 *  - Percentage text (Inter 14 semibold, text-secondary) aligned right
 *
 * Rows separated by 24px vertical gap (per 72px row height pattern).
 */
import { ProgressBar } from "./ProgressBar";

export type ZoneActivityRow = {
  label: string;
  /** 0–100 */
  pct: number;
};

export function ZoneActivityList({ rows }: { rows: ZoneActivityRow[] }) {
  return (
    <ul className="flex flex-col gap-3xl">
      {rows.map((r) => (
        <li key={r.label} className="flex flex-col gap-sm">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium text-text-primary">
              {r.label}
            </span>
            <span className="text-sm font-semibold text-text-secondary">
              {r.pct}%
            </span>
          </div>
          <ProgressBar value={r.pct} label={`${r.label} activity`} />
        </li>
      ))}
    </ul>
  );
}
