/**
 * TableCell — a single <td> cell.
 * Figma: node 464:10449 "Table cell item" (80 × 72px measured)
 * Spec:
 *  - height: 72px fixed (Figma measured, per user decision)
 *  - background: bg-primary (#ffffff)
 *  - border: none on cell (TableRow draws horizontal separators)
 *  - padding: px=24px (3xl), py=16px (xl)
 *  - typography: Inter 14px / 20px regular, text-primary (#111322)
 */
import type { TdHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement> & {
  children: ReactNode;
};

export function TableCell({ children, className, ...props }: TableCellProps) {
  return (
    <td
      className={cn(
        // height from Figma measurement (72px)
        "h-[72px]",
        // Cell owns the white bg. When the parent <tr> is interactive it
        // carries `.group`, so `group-hover:bg-bg-primary-hover` makes every
        // cell in that row switch together — otherwise the cell bg would
        // paint over any hover color set on the <tr>.
        "bg-bg-primary group-hover:bg-bg-primary-hover",
        "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-fast)]",
        "px-3xl py-xl",
        "align-middle",
        "text-sm font-normal text-text-primary",
        "whitespace-nowrap",
        className,
      )}
      {...props}
    >
      {children}
    </td>
  );
}
