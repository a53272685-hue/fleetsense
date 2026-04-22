/**
 * MiniMetric — single row card with label, big number, and "vs last week" suffix.
 * Figma: node 283:11084 "Mini Metrics" (370 × 118)
 * Spec:
 *  - border border-secondary, rounded-xl (12), bg-primary, p-24 (3xl)
 *  - flex col gap-8 (md)
 *  - top row: label (sm medium, text-tertiary) + info icon 20×20 right
 *  - value row: Inter text-xl 20/30 semibold text-primary + "vs last week" text-sm regular text-tertiary
 */
import type { ReactNode } from "react";
import { InfoIcon } from "@/components/icons";

export type MiniMetricProps = {
  label: string;
  value: ReactNode;
  suffix?: ReactNode;
};

export function MiniMetric({ label, value, suffix = "vs last week" }: MiniMetricProps) {
  return (
    <article className="flex w-full flex-col gap-md rounded-xl border border-border-secondary bg-bg-primary p-3xl">
      <div className="flex items-start justify-between">
        <p className="flex-1 text-sm font-medium text-text-tertiary">{label}</p>
        <InfoIcon className="h-5 w-5 shrink-0 text-fg-quaternary" />
      </div>
      <div className="flex items-end gap-md">
        <p className="text-xl font-semibold text-text-primary whitespace-nowrap">
          {value}
        </p>
        <p className="flex-1 truncate text-sm font-normal text-text-tertiary">
          {suffix}
        </p>
      </div>
    </article>
  );
}
