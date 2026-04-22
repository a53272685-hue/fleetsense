"use client";

/**
 * DotsMenu — "…" (vertical dots) trigger that opens a dropdown menu.
 * Matches the Figma "Chart dropdown" spec (node 19865:748):
 *  - Trigger: DotsVerticalIcon button (fg-quaternary, hover → fg-quaternary-hover)
 *  - Panel: 248px wide, rounded-md, border-secondary, shadow-lg, bg-primary
 *  - Items: text-sm semibold, text-secondary, radius-sm, hover bg-primary-hover
 *  - Open animation: fs-scale-pop (scale 0.95 → 1 + fade, 200ms ease-out-fast)
 *
 * a11y:
 *  - button has aria-haspopup="menu", aria-expanded
 *  - panel has role="menu", items role="menuitem"
 *  - ESC closes, click-outside closes
 *  - Focus returns to trigger on close
 *
 * Icons on the menu items are intentionally omitted for now — the Figma spec
 * calls for `download-01` / `file-06` / `share-04`, which haven't been
 * exported yet (see spawned task). Labels alone are still functional.
 */
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { DotsVerticalIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export type DotsMenuItem = {
  label: string;
  onSelect?: () => void;
  /** Future: Figma icon component once extracted. */
  icon?: ReactNode;
  /** Renders a red destructive item (not used yet, reserved). */
  destructive?: boolean;
};

export type DotsMenuProps = {
  items: DotsMenuItem[];
  /** Panel alignment relative to the trigger. Defaults to right edge. */
  align?: "start" | "end";
  /** Accessible label for the trigger. Defaults to "More options". */
  ariaLabel?: string;
  className?: string;
};

export function DotsMenu({
  items,
  align = "end",
  ariaLabel = "More options",
  className,
}: DotsMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  // Close on outside click + ESC, and restore focus to trigger.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative inline-flex", className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "rounded-sm text-fg-quaternary",
          "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-fast)]",
          "hover:text-fg-quaternary-hover",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg-brand-primary",
        )}
      >
        <DotsVerticalIcon className="h-5 w-5" />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={ariaLabel}
          // scale-pop entry: scale 0.95 → 1 + fade (200ms, ease-out-fast)
          className={cn(
            "fs-animate-pop",
            "absolute top-[calc(100%+6px)] z-50",
            align === "end" ? "right-0" : "left-0",
            "w-[248px] rounded-md border border-border-secondary bg-bg-primary",
            "shadow-lg",
            "py-xs",
            // Transform origin so the scale feels anchored near the trigger
            align === "end" ? "origin-top-right" : "origin-top-left",
          )}
        >
          {items.map((it) => (
            <button
              key={it.label}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                it.onSelect?.();
              }}
              className={cn(
                "flex w-full items-center gap-md",
                "mx-sm rounded-sm px-[10px] py-md",
                "text-sm font-semibold text-text-secondary text-left",
                "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-fast)]",
                "hover:bg-bg-primary-hover",
                "focus-visible:outline-none focus-visible:bg-bg-primary-hover",
                it.destructive && "text-text-error-primary",
              )}
              style={{ width: "calc(100% - 12px)" }}
            >
              {it.icon ? (
                <span className="shrink-0 text-fg-quaternary">{it.icon}</span>
              ) : null}
              <span className="flex-1">{it.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
