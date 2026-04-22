/**
 * ChartLegend — row of dot + label pairs for chart legends.
 * Figma: "Legend series" instance (8px circle + sm regular label)
 */
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type LegendItem = { label: ReactNode; color: string };

export function ChartLegend({
  items,
  className,
}: {
  items: LegendItem[];
  className?: string;
}) {
  return (
    <ul className={cn("flex items-center justify-end gap-md", className)}>
      {items.map((it, i) => (
        <li key={i} className="flex items-center gap-md">
          <span
            aria-hidden
            className="inline-block h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: it.color }}
          />
          <span className="text-sm font-normal text-text-tertiary whitespace-nowrap">
            {it.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
