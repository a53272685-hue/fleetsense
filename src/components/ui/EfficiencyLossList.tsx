/**
 * EfficiencyLossList — narrow list of loss segments with $ amounts.
 * Figma: "Efficiency Loss Segments" card on /efficiency/driver-deep-dive.
 *
 * Each row: title text + trailing $ value (text-primary semibold).
 * Rows separated by full-width dividers (border-secondary).
 */
import { InfoIcon } from "@/components/icons";

export type EfficiencyLossItem = {
  label: string;
  amount: string; // e.g. "$ 12.5"
};

export function EfficiencyLossList({ items }: { items: EfficiencyLossItem[] }) {
  return (
    <ul className="flex flex-col divide-y divide-border-secondary">
      {items.map((it) => (
        <li
          key={it.label}
          className="flex items-center justify-between gap-lg px-3xl py-xl"
        >
          <div className="flex items-center gap-sm text-sm font-medium text-text-secondary">
            {it.label}
            <InfoIcon className="h-4 w-4 text-fg-quaternary" />
          </div>
          <span className="text-base font-semibold text-text-primary">
            {it.amount}
          </span>
        </li>
      ))}
    </ul>
  );
}
