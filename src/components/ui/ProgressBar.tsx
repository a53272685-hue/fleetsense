/**
 * ProgressBar — horizontal progress track with brand-colored fill.
 * Figma: 2223:11483 "Progress bar"
 *  - track: gray-200 (#eaecf0) or quaternary (#dcdfea), rounded-full
 *  - fill: brand blue (#1570ef from --fg-brand-primary)
 *
 * `size`: "md" (default, 8px) or "lg" (12px, more visible — used in
 * tables like Driver Performance Leaderboard where the bar is the
 * primary signal in the row).
 *
 * a11y: `label` is REQUIRED — without it, screen readers announce
 * bare numbers ("progressbar, 78") with no subject. Supply a sentence
 * describing what is progressing, e.g. "Driver John Smith safety score".
 * WCAG 1.1.1 (A) + 4.1.2 (A).
 */
type Size = "md" | "lg";

const SIZE_CLASS: Record<Size, string> = {
  md: "h-2",
  lg: "h-[10px]",
};

export function ProgressBar({
  value,
  max = 100,
  size = "md",
  label,
}: {
  value: number;
  max?: number;
  size?: Size;
  /** Accessible name. Required — describe what is progressing. */
  label: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={`relative ${SIZE_CLASS[size]} w-full overflow-hidden rounded-full bg-bg-quaternary`}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-fg-brand-primary"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
