"use client";

/**
 * MainNav — top-level section switcher (Row A).
 * Figma: DesignSystem "Navigation" frame (19710:6160), "Header navigation" symbol.
 *
 * Layout:
 *  - FleetSense brand (left)
 *  - Horizontal nav items: icon + label (Utilization / Forms / Efficiency / Compliance / Deep Dive)
 *  - Right tools: search / settings / notification / Leave button
 *
 * Interactions (from Figma design system node 19511:2262 "Nav item base"):
 *  - Default: bg-primary, text-text-quaternary, fg-quaternary icon
 *  - Hover: bg-bg-primary-hover (#eff1f5), same text/icon colors
 *  - Active (current section): text-text-primary (dark), icon brand blue
 *  - All states use rounded-sm (6px) + px-lg py-md padding per spec
 *
 * `usePathname` detects which section is active (first path segment match).
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROW_A } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { SearchLgIcon, Settings01Icon, Bell01Icon } from "@/components/icons";

function isSectionActive(href: string, pathname: string) {
  // Match first path segment — "/utilization/overview" matches "/utilization/overview"
  // or any deeper path under the same section.
  const segment = href.split("/").filter(Boolean)[0];
  return pathname.split("/").filter(Boolean)[0] === segment;
}

export function MainNav() {
  const pathname = usePathname() ?? "/";

  return (
    <header className="border-b border-border-secondary bg-bg-primary">
      <nav className="flex h-14 items-center gap-2xl px-4xl">
        {/* Brand */}
        <Link
          href="/"
          className="shrink-0 text-base font-semibold text-text-primary"
          aria-label="FleetSense home"
        >
          FleetSense
        </Link>

        {/* Nav items */}
        <ul className="flex flex-1 items-center gap-xl">
          {ROW_A.map((item) => {
            const Icon = item.icon;
            const active = isSectionActive(item.href, pathname);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    // Figma spec: px-lg (12), py-md (8), rounded-sm (6)
                    "inline-flex items-center gap-md rounded-sm px-lg py-md",
                    "text-base font-semibold leading-6",
                    "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-fast)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg-brand-primary",
                    active
                      ? // Active state: dark text, icon turns brand blue below
                        "text-text-primary"
                      : // Default: quaternary text; hover adds bg tint per Figma
                        "text-text-quaternary hover:bg-bg-primary-hover",
                  )}
                >
                  {Icon ? (
                    <Icon
                      className={cn(
                        "h-[18px] w-[18px]",
                        active ? "text-fg-brand-primary" : "text-fg-quaternary",
                      )}
                    />
                  ) : null}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right-side tools — search, settings, notifications, Leave button. */}
        <div className="flex shrink-0 items-center gap-sm">
          {[
            { Icon: SearchLgIcon, label: "Search" },
            { Icon: Settings01Icon, label: "Settings" },
            { Icon: Bell01Icon, label: "Notifications" },
          ].map(({ Icon, label }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-sm",
                "text-fg-quaternary",
                "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-fast)]",
                "hover:bg-bg-primary-hover hover:text-fg-quaternary-hover",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg-brand-primary",
              )}
            >
              <Icon className="h-5 w-5" />
            </button>
          ))}
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-xs rounded-md",
              "border border-border-secondary bg-bg-primary",
              "px-[14px] py-[8px]",
              "text-sm font-semibold text-text-secondary",
              "shadow-xs",
              "transition-[background-color,transform] duration-[var(--duration-fast)] ease-[var(--ease-out-fast)]",
              "hover:bg-bg-primary-hover active:scale-[0.98]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg-brand-primary",
            )}
          >
            Leave
          </button>
        </div>
      </nav>
    </header>
  );
}
