/**
 * FilterChip — pill button used in Page header filter row.
 * Figma: "Filter button" / "header filter" buttons
 * Spec:
 *  - bg-primary (#fff), border-secondary (#dcdfea) 1px
 *  - rounded-md (8px)
 *  - padding: px-[14px] py-[10px]  (Figma literal; not a spacing token)
 *  - gap: 4px (xs)
 *  - Inter 14/20 semibold, color text-secondary (#404968)
 *  - leftIcon / rightIcon 16–20px
 */
import type { ReactNode, ComponentType, SVGProps } from "react";
import { cn } from "@/lib/utils";

export type FilterChipProps = {
  leftIcon?: ComponentType<SVGProps<SVGSVGElement>>;
  rightIcon?: ComponentType<SVGProps<SVGSVGElement>>;
  children: ReactNode;
  /** Visual grouping: left/middle/right pill of a segmented group; default is standalone. */
  segment?: "left" | "right" | "standalone";
  className?: string;
};

export function FilterChip({
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  children,
  segment = "standalone",
  className,
}: FilterChipProps) {
  const radius =
    segment === "left"
      ? "rounded-l-md"
      : segment === "right"
        ? "rounded-r-md"
        : "rounded-md";
  const borderSide =
    segment === "right" ? "border-t border-r border-b" : "border";
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-xs",
        "bg-bg-primary border-border-secondary",
        borderSide,
        radius,
        "px-[14px] py-[10px]",
        "text-sm font-semibold text-text-secondary",
        "transition-[background-color,transform] duration-[var(--duration-fast)] ease-[var(--ease-out-fast)]",
        "hover:bg-bg-primary-hover active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg-brand-primary",
        className,
      )}
    >
      {LeftIcon ? <LeftIcon className="h-5 w-5" /> : null}
      <span className="px-xxs">{children}</span>
      {RightIcon ? <RightIcon className="h-4 w-4" /> : null}
    </button>
  );
}
