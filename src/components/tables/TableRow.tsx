/**
 * TableRow — a single <tr> grouping either header cells or body cells.
 * Body rows get a bottom separator (border-secondary 1px) between them;
 * header rows let TableHeader cells draw their own borders.
 *
 * When `interactive` is set, the row becomes a clickable affordance:
 *  - cursor-pointer + role="button" + keyboard activation (Enter/Space)
 *  - hover: bg-bg-primary-hover
 *  - active: scale 0.99 (subtle press feedback)
 *  - transitions use motion tokens (duration-fast, ease-out-fast)
 */
import type { HTMLAttributes, KeyboardEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TableRowProps = HTMLAttributes<HTMLTableRowElement> & {
  children: ReactNode;
  /** When true, this row is in tbody and gets a bottom separator. */
  body?: boolean;
  /** When true, adds hover/active affordances and keyboard handler. */
  interactive?: boolean;
};

export function TableRow({
  children,
  body = true,
  interactive = false,
  className,
  onClick,
  onKeyDown,
  ...props
}: TableRowProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTableRowElement>) => {
    onKeyDown?.(e);
    if (!interactive || !onClick) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(e as unknown as Parameters<NonNullable<typeof onClick>>[0]);
    }
  };

  return (
    <tr
      className={cn(
        body && "border-b border-border-secondary",
        interactive && [
          // `.group` lets every <td> in this row react via
          // `group-hover:bg-bg-primary-hover` (bg is painted on the cells
          // because td backgrounds would otherwise cover a tr-level bg).
          "group",
          "cursor-pointer",
          "origin-center",
          "transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out-fast)]",
          "active:scale-[0.99]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg-brand-primary focus-visible:ring-inset",
        ],
        className,
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      {...props}
    >
      {children}
    </tr>
  );
}
