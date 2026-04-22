/**
 * TableHeader — a single <th> cell.
 * Figma: node 464:10440 "Table header cell" (80 × 44px measured)
 * Spec:
 *  - height: 44px fixed
 *  - background: bg-secondary (#fafafa)
 *  - border: top/bottom only (no vertical separators between cells), border-secondary (#dcdfea) 1px
 *  - padding: px=24px (3xl), py=12px (lg)
 *  - typography: Inter 12px / 18px semibold, text-quaternary (#717680)
 *  - gap: 12px between label and optional sort icon
 */
import type { ThHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TableHeaderProps = ThHTMLAttributes<HTMLTableCellElement> & {
  children: ReactNode;
};

export function TableHeader({ children, className, ...props }: TableHeaderProps) {
  return (
    <th
      className={cn(
        // height from Figma measurement (44px)
        "h-[44px]",
        "bg-bg-secondary",
        "border-t border-b border-border-secondary",
        "px-3xl py-lg",
        "text-left align-middle",
        "text-xs font-semibold text-text-quaternary",
        "whitespace-nowrap",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-lg">{children}</div>
    </th>
  );
}
