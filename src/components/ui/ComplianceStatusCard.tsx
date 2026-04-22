/**
 * ComplianceStatusCard — big card at top of /compliance/overview.
 * Figma: 3 cards in KpiRow (359:15946).
 *
 * Structure:
 *  - Header: icon badge (alert/file/truck) + title
 *  - Body: one or two "label + value" rows with optional progress bar
 *  - Each body row has: label text + optional bar (with right-side value)
 *  - Footer: "View →" link to detail page
 */
import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { KpiIconBadge } from "./KpiIconBadge";
import { ProgressBar } from "./ProgressBar";
import { ChevronDownIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export type ComplianceStatusRow = {
  label: string;
  /** If provided, render a progress bar with this percentage. */
  barPct?: number;
  /** Right-aligned trailing text (e.g. "14 days", "82%", "3"). */
  value?: string;
};

export type ComplianceStatusCardProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  iconTone?: "brand" | "success" | "warning" | "error" | "gray";
  title: string;
  /** Primary big number (e.g. "380", "14%", "22"). */
  primaryLabel: string;
  primaryValue: string;
  /** Additional label+bar rows (0–2). */
  rows?: ComplianceStatusRow[];
  /** Where "View →" link goes. */
  viewHref: string;
};

export function ComplianceStatusCard({
  icon,
  iconTone = "gray",
  title,
  primaryLabel,
  primaryValue,
  rows = [],
  viewHref,
}: ComplianceStatusCardProps) {
  return (
    <article
      className={cn(
        "flex flex-col gap-lg rounded-xl border border-border-secondary bg-bg-primary p-3xl shadow-xs",
        "transition-[transform,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out-fast)]",
        "hover:-translate-y-px hover:shadow-lg",
      )}
    >
      <header className="flex items-center gap-md">
        <KpiIconBadge icon={icon} tone={iconTone} />
        <p className="text-lg font-semibold text-text-primary">{title}</p>
      </header>

      <div className="flex flex-col gap-xs">
        <p className="text-sm font-medium text-text-tertiary">{primaryLabel}</p>
        <p className="text-display-sm font-bold leading-[38px] text-text-primary">
          {primaryValue}
        </p>
      </div>

      {rows.length > 0 ? (
        <div className="flex flex-col gap-md">
          {rows.map((r) => (
            <div
              key={r.label}
              className="grid grid-cols-[120px_1fr_auto] items-center gap-md text-sm"
            >
              <span className="text-text-tertiary">{r.label}</span>
              {typeof r.barPct === "number" ? (
                <ProgressBar value={r.barPct} />
              ) : (
                <span />
              )}
              {r.value ? (
                <span className="font-medium text-text-secondary">
                  {r.value}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      <Link
        href={viewHref}
        className={cn(
          "inline-flex items-center gap-xs self-end text-sm font-semibold text-fg-brand-primary",
          "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-fast)]",
          "hover:text-fg-brand-primary-alt focus-visible:outline-none focus-visible:underline",
        )}
      >
        View
        <ChevronDownIcon className="h-4 w-4 -rotate-90" />
      </Link>
    </article>
  );
}
