/**
 * ProgressBar — horizontal progress track with brand-colored fill.
 * Figma: 2223:11483 "Progress bar"
 *  - track: bg-quaternary (#dcdfea), h-2 (8px), rounded-full
 *  - fill: bg brand blue (#1570ef from --fg-brand-primary)
 */
export function ProgressBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className="relative h-2 w-full overflow-hidden rounded-full bg-bg-quaternary"
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-fg-brand-primary"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
