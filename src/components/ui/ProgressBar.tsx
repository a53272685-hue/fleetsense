/**
 * ProgressBar — horizontal progress track with brand-colored fill.
 * Figma: 2223:11483 "Progress bar"
 *  - track: bg-tertiary (#eff1f5) — light enough that the fill reads as
 *    prominent (Figma spec uses #e9eaeb; our nearest token #eff1f5 is
 *    a touch lighter, which further increases fill contrast)
 *  - fill: brand blue (#1570ef from --fg-brand-primary)
 *
 * NOTE: track previously used bg-bg-quaternary (#dcdfea) but reviewers
 * reported the fill felt washed-out — the darker track pulled visual
 * weight from the fill. Switching to bg-bg-tertiary aligns with Figma
 * node 406:11480 (Driver Performance Leaderboard row cell) and makes
 * the fill color read as saturated/bold.
 *
 * `size`: "md" (default, 8px) or "lg" (10px, more visible — used in
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
      className={`relative ${SIZE_CLASS[size]} w-full overflow-hidden rounded-full bg-bg-tertiary`}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-fg-brand-primary"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
