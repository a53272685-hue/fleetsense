"use client";

/**
 * SubNav — section tabs (Row B). Renders tabs for the current section.
 * Figma: DesignSystem "Navigation" (19710:6160), "Tabs" section.
 *
 * Layout:
 *  - Horizontal row of tab links
 *  - Active tab has a brand-colored 2px underline sitting flush with the
 *    bottom border of the container
 *
 * Interactions:
 *  - Default: text-text-tertiary
 *  - Hover: text-text-primary + subtle bg-primary-hover on the tab
 *  - Active: text-fg-brand-primary + brand underline
 *  - All color transitions use motion tokens
 *
 * Accessibility:
 *  - `<nav aria-label="Section">` wrapper
 *  - Active tab uses aria-current="page"
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROW_B, getSubNavKey } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function SubNav() {
  const pathname = usePathname() ?? "/";
  const sectionKey = getSubNavKey(pathname);
  if (!sectionKey) return null;
  const items = ROW_B[sectionKey];

  return (
    <div className="border-b border-border-secondary bg-bg-primary">
      <nav
        aria-label="Section tabs"
        className="flex h-11 items-end gap-md px-4xl"
      >
        {items.map((item) => {
          // Exact-match preferred; fall back to prefix match so deeper routes
          // (e.g. vehicle-deep-dive/[id]) still highlight their tab.
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative inline-flex items-center",
                "h-11 px-md",
                "text-sm font-medium whitespace-nowrap",
                "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-fast)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg-brand-primary focus-visible:ring-inset",
                active
                  ? "text-fg-brand-primary"
                  : "text-text-tertiary hover:text-text-primary",
              )}
            >
              {item.label}
              {/* Active underline — 2px brand, flush with container bottom
                  border (sits on top of it). Negative bottom overlaps the
                  1px divider so there's no double-line seam. */}
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute inset-x-0 -bottom-px h-[2px] rounded-full",
                  "transition-[opacity,transform] duration-[var(--duration-fast)] ease-[var(--ease-out-fast)]",
                  active
                    ? "bg-fg-brand-primary opacity-100 scale-x-100"
                    : "bg-fg-brand-primary opacity-0 scale-x-75",
                )}
              />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
