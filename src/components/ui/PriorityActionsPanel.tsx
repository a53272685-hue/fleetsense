/**
 * PriorityActionsPanel — stacked alert list panel used on /compliance/overview.
 * Figma: "Priority Actions (7)" frame (359:15946 sub-panel).
 *
 * Each row: leading icon badge (warning / error tone) + count + title +
 * subtitle + trailing chevron. The whole row acts as a link.
 */
import type { ComponentType, SVGProps, ReactNode } from "react";
import Link from "next/link";
import { ChevronDownIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export type PriorityAction = {
  id: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** Background tone behind the icon. */
  tone: "error" | "warning";
  /** Big count / label shown before title, e.g. "380 Blank Logs". */
  title: string;
  subtitle: string;
  href: string;
};

const TONE_STYLES: Record<"error" | "warning", string> = {
  error:
    "bg-[var(--utility-error-50)] border-[var(--utility-error-200)] text-[var(--utility-error-500)]",
  warning:
    "bg-[var(--utility-warning-50)] border-[var(--utility-warning-200)] text-[var(--utility-warning-500)]",
};

export function PriorityActionsPanel({
  count,
  actions,
  viewAllHref,
}: {
  count: number;
  actions: PriorityAction[];
  viewAllHref?: string;
}) {
  return (
    <section className="flex flex-col overflow-hidden rounded-xl border border-border-secondary bg-bg-primary">
      <header className="flex items-center justify-between px-3xl py-2xl">
        <h2 className="text-lg font-semibold text-text-primary">
          Priority Actions{" "}
          <span className="text-text-tertiary">({count})</span>
        </h2>
        {viewAllHref ? (
          <Link
            href={viewAllHref}
            className="text-sm font-semibold text-fg-brand-primary hover:underline"
          >
            View All
          </Link>
        ) : null}
      </header>
      <ul className="flex flex-col gap-md p-md">
        {actions.map((a) => (
          <PriorityActionRow key={a.id} action={a} />
        ))}
      </ul>
    </section>
  );
}

function PriorityActionRow({ action }: { action: PriorityAction }) {
  const Icon = action.icon;
  return (
    <li>
      <Link
        href={action.href}
        className={cn(
          "flex items-center gap-lg rounded-md border px-lg py-md",
          "transition-[transform,background-color] duration-[var(--duration-fast)] ease-[var(--ease-out-fast)]",
          "active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg-brand-primary",
          TONE_STYLES[action.tone],
          "hover:brightness-95",
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-sm font-semibold text-text-primary">
            {action.title}
          </span>
          <span className="text-sm text-text-tertiary">{action.subtitle}</span>
        </div>
        <ChevronDownIcon className="h-4 w-4 shrink-0 -rotate-90 text-fg-quaternary" />
      </Link>
    </li>
  );
}

export type PriorityActionsContentNode = ReactNode;
