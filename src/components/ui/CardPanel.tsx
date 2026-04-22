/**
 * CardPanel — rounded card with Card header B (title + dots menu + divider).
 * Figma: Card header B (279:8647)
 * Spec:
 *  - outer: border border-secondary, rounded-xl (12)
 *  - header: bg-primary, py-20 (2xl) px-24 (3xl), title text-lg 18/28 semibold, dots 28×28
 *  - divider: h-px border-secondary
 */
import type { ReactNode } from "react";
import { DotsVerticalIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export type CardPanelProps = {
  title: string;
  children: ReactNode;
  headerExtra?: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function CardPanel({
  title,
  children,
  headerExtra,
  className,
  contentClassName,
}: CardPanelProps) {
  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border-secondary bg-bg-primary",
        className,
      )}
    >
      <header className="flex flex-col gap-2xl">
        <div className="flex items-start gap-xl px-3xl pt-2xl">
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <div className="flex items-center gap-md">
              <h2 className="text-lg font-semibold text-text-primary">
                {title}
              </h2>
              {headerExtra}
            </div>
          </div>
          <button
            type="button"
            aria-label="More options"
            className="text-fg-quaternary hover:text-fg-quaternary-hover"
          >
            <DotsVerticalIcon className="h-7 w-7" />
          </button>
        </div>
        <div className="h-px w-full bg-border-secondary" />
      </header>
      <div className={cn("pt-2xl", contentClassName)}>{children}</div>
    </section>
  );
}
