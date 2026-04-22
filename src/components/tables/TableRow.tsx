/**
 * TableRow — a single <tr> grouping either header cells or body cells.
 * Body rows get a bottom separator (border-secondary 1px) between them;
 * header rows let TableHeader cells draw their own borders.
 *
 * Two activation modes:
 *
 *  1. `interactive` — the WHOLE row is the primary action target.
 *     Adds role="button", tabindex=0, Enter/Space keyboard activation,
 *     focus-visible ring, hover bg, active scale. Use this ONLY when
 *     no child cell contains its own <button>/<a>/<select> — otherwise
 *     axe-core flags `nested-interactive` (WCAG 4.1.2 A).
 *
 *  2. `hoverable` — the row has visible hover feedback but is NOT
 *     announced as a button. Use when a cell inside already owns the
 *     real action (e.g. a "View Profile" <button> or DotsMenu). The
 *     row-level onClick still fires for mouse convenience, but
 *     keyboard users navigate to the inner button instead. This keeps
 *     WCAG 4.1.2 A compliant while preserving the full-row hover
 *     affordance designers expect.
 *
 *  Both modes use `.group` so TableCell's `group-hover:bg-bg-primary-hover`
 *  fires across every cell at once.
 */
import type { HTMLAttributes, KeyboardEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TableRowProps = HTMLAttributes<HTMLTableRowElement> & {
  children: ReactNode;
  /** When true, this row is in tbody and gets a bottom separator. */
  body?: boolean;
  /** Row is the primary action target. Adds role=button + keyboard nav. */
  interactive?: boolean;
  /** Row shows hover feedback but is NOT a semantic button. Use when
   *  child cells already own the real interactive controls. */
  hoverable?: boolean;
};

export function TableRow({
  children,
  body = true,
  interactive = false,
  hoverable = false,
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

  const hasHoverStyle = interactive || hoverable;

  return (
    <tr
      className={cn(
        body && "border-b border-border-secondary",
        hasHoverStyle && [
          // `.group` lets every <td> in this row react via
          // `group-hover:bg-bg-primary-hover`.
          "group",
          "cursor-pointer",
          "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-fast)]",
        ],
        interactive && [
          "origin-center",
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
