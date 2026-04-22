/**
 * PageHeader — title + filter chips row.
 * Figma: node 273:6080 "Page header"
 * Spec:
 *  - flex col gap-xl (16)
 *  - ToolbarRow: flex items-end; content row h-40, flex wrap gap-xl
 *  - Title: Inter display-sm 30px / 38px semibold, color text-primary
 *  - Right cluster: segmented date chip + Filters button
 */
import type { ReactNode } from "react";

export type PageHeaderProps = {
  title: string;
  actions?: ReactNode;
};

export function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-xl">
      <div className="flex items-end">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-xl">
          <div className="flex min-w-[320px] flex-1 flex-col items-start">
            <h1 className="whitespace-nowrap text-display-sm font-semibold text-text-primary">
              {title}
            </h1>
          </div>
          {actions}
        </div>
      </div>
    </div>
  );
}
