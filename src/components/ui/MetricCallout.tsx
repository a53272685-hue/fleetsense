/**
 * MetricCallout — a single number + colored-square label.
 * Figma: node 286:15858 "SectionHeading" inside Fleet Composition card.
 * Spec:
 *  - Number: display-xs 24/32 semibold, text-primary
 *  - Indicator: 14×14 rounded-xxs (2px), bg = category color
 *  - Label: text-sm 14/20 medium, text-tertiary
 */
export type MetricCalloutProps = {
  number: string | number;
  label: string;
  swatchColor: string;
};

export function MetricCallout({ number, label, swatchColor }: MetricCalloutProps) {
  return (
    <div className="flex w-[120px] flex-col items-start gap-xs">
      <p className="text-2xl font-semibold text-text-primary">{number}</p>
      <div className="flex w-full items-center gap-xs">
        <span
          aria-hidden
          className="inline-block h-[14px] w-[14px] shrink-0 rounded-xxs"
          style={{ backgroundColor: swatchColor }}
        />
        <span className="text-sm font-medium text-text-tertiary whitespace-nowrap">
          {label}
        </span>
      </div>
    </div>
  );
}
