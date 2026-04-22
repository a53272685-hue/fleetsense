/**
 * Shared Recharts Tooltip styling — matches Figma design system
 * "Tooltips / label" variant (node 19769:582):
 *  - dark body: rgba(0,0,0,0.8) (black @ 80% opacity)
 *  - white text (text-primary_on-brand)
 *  - radius-xs (4px), shadow-xs
 *  - padding 8px, text-xs (12/18) for rows, text-xs medium for values
 *
 * Spread via {...chartTooltipStyle} on any Recharts <Tooltip/>.
 */
export const chartTooltipStyle = {
  contentStyle: {
    background: "rgba(0, 0, 0, 0.8)",
    border: "none",
    borderRadius: "var(--radius-xs, 4px)",
    boxShadow: "var(--shadow-xs)",
    padding: "8px",
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "12px",
    lineHeight: "18px",
    color: "var(--text-primary-on-brand, #ffffff)",
  },
  labelStyle: {
    color: "var(--text-primary-on-brand, #ffffff)",
    fontSize: "12px",
    fontWeight: 500,
    marginBottom: 4,
  },
  itemStyle: {
    color: "var(--text-primary-on-brand, #ffffff)",
    fontSize: "12px",
    lineHeight: "18px",
    padding: 0,
  },
  // tooltip fade-in (transform/opacity only, GPU-accelerated)
  wrapperStyle: {
    outline: "none",
    transition:
      "opacity var(--duration-fast) var(--ease-out-fast), transform var(--duration-fast) var(--ease-out-fast)",
  },
} as const;
