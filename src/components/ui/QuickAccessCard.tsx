/**
 * QuickAccessCard — featured template card on /forms/templates.
 * Figma: "Quick Access" grid (349:15724 sub-frames).
 *
 * Layout:
 *  - Top: icon badge (tone-aware)
 *  - Middle: title + description (2-line clamp)
 *  - Bottom: "Used N ago" + chevron-right
 */
import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { KpiIconBadge } from "./KpiIconBadge";
import { ChevronDownIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export type QuickAccessCardProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  iconTone?: "brand" | "success" | "warning" | "error" | "gray";
  title: string;
  description: string;
  lastUsed: string;
  href: string;
};

export function QuickAccessCard({
  icon,
  iconTone = "brand",
  title,
  description,
  lastUsed,
  href,
}: QuickAccessCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col gap-md rounded-xl border border-border-secondary bg-bg-primary p-3xl shadow-xs",
        "transition-[transform,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out-fast)]",
        "hover:-translate-y-px hover:shadow-lg",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg-brand-primary",
      )}
    >
      <KpiIconBadge icon={icon} tone={iconTone} />
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      <p className="line-clamp-2 text-sm text-text-tertiary">{description}</p>
      <div className="mt-auto flex items-center justify-between pt-lg">
        <span className="text-xs text-text-quaternary">Used {lastUsed}</span>
        <ChevronDownIcon className="h-4 w-4 -rotate-90 text-fg-quaternary" />
      </div>
    </Link>
  );
}
