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
 *  - Default: text-text-quaternary, no underline
 *  - Hover (non-active): text darkens + **gray underline** at the same bottom
 *    position the brand underline would occupy when active
 *  - Active: text-fg-brand-primary + **brand underline** (always wins over hover)
 *  - All color transitions use motion tokens
 *
 * The underline is a single absolutely-positioned span per tab whose color
 * switches via classes — one element, two visual states, no layout shift.
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
              data-active={active || undefined}
              className={cn(
                "group relative inline-flex items-center",
                "h-11 px-md",
                "text-base font-medium leading-6 whitespace-nowrap",
                "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-fast)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg-brand-primary focus-visible:ring-inset",
                active
                  ? "text-fg-brand-primary"
                  : "text-text-quaternary hover:text-text-primary",
              )}
            >
              {item.label}
              {/* Underline — one 2px span per tab, colour decided by state:
                    - Active: opacity 100, brand blue (always visible)
                    - Non-active hover: opacity 100, gray (border-primary)
                    - Non-active default: opacity 0
                  Sits on top of the container's 1px bottom border via -bottom-px
                  so there's no double-line seam. */}
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute inset-x-0 -bottom-px h-[2px] rounded-full",
                  "transition-[opacity,transform,background-color] duration-[var(--duration-fast)] ease-[var(--ease-out-fast)]",
                  active
                    ? "bg-fg-brand-primary opacity-100 scale-x-100"
                    : "bg-border-primary opacity-0 scale-x-75 group-hover:opacity-100 group-hover:scale-x-100",
                )}
              />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
