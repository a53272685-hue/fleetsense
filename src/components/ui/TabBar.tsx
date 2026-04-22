"use client";

/**
 * TabBar — segmented control (e.g. "7 days / 14 days / 1 month").
 * Figma: node 372:9113
 * Spec:
 *  - outer: bg-secondary (#f9f9fb), border border-secondary, rounded-sm (6px), p-0, gap-[2px]
 *  - active: bg-primary (#fff), border-primary (#d5d7da) 1px, shadow-xs, text-secondary-700
 *  - inactive: transparent, text-quaternary-500, no border
 *  - each tab: h-32, px-12 (lg), py-8 (md), Inter 14/20 semibold, rounded-sm/md
 */
import { cn } from "@/lib/utils";

export type TabBarProps<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
};

export function TabBar<T extends string>({ options, value, onChange }: TabBarProps<T>) {
  return (
    <div
      role="tablist"
      className="inline-flex items-center gap-[2px] rounded-sm border border-border-secondary bg-bg-secondary p-0"
    >
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt)}
            className={cn(
              "h-8 px-lg py-md",
              "text-sm font-semibold whitespace-nowrap",
              active
                ? "rounded-sm border border-border-primary bg-bg-primary text-text-secondary shadow-xs"
                : "rounded-md text-text-quaternary hover:text-text-secondary",
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
