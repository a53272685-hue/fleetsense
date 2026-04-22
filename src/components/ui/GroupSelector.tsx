"use client";

/**
 * GroupSelector — pair of "Your group: X vs Other group: Y" dropdowns.
 * Figma: utilization/group-comparison top row.
 *
 * Each selector is a rounded pill with:
 *  - label ("Your group:" / "Other group:")
 *  - color swatch dot (brand-500 for yours, purple-500 for other by default)
 *  - current group name
 *  - chevron-down indicator
 *
 * Non-functional for now (no actual dropdown menu) — matches Figma static state.
 */
import { ChevronDownIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export type GroupSelectorGroup = {
  label: "Your group" | "Other group";
  value: string;
  /** CSS var reference, e.g. "var(--utility-brand-500)" */
  color: string;
};

export function GroupSelector({
  your,
  other,
}: {
  your: GroupSelectorGroup;
  other: GroupSelectorGroup;
}) {
  return (
    <div className="flex items-center gap-lg">
      <GroupPill group={your} />
      <span className="text-sm font-medium text-text-tertiary">vs</span>
      <GroupPill group={other} />
    </div>
  );
}

function GroupPill({ group }: { group: GroupSelectorGroup }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-10 items-center gap-md rounded-md border border-border-secondary bg-bg-primary px-[14px]",
        "text-sm text-text-secondary shadow-xs",
        "transition-[background-color,transform] duration-[var(--duration-fast)] ease-[var(--ease-out-fast)]",
        "hover:bg-bg-primary-hover active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg-brand-primary",
      )}
      aria-haspopup="listbox"
    >
      <span className="text-text-tertiary">{group.label}:</span>
      <span
        aria-hidden
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: group.color }}
      />
      <span className="font-medium">{group.value}</span>
      <ChevronDownIcon className="h-4 w-4 text-fg-quaternary" />
    </button>
  );
}
