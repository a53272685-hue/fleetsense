/**
 * TableSectionHeader — card header used above tables/sections.
 * Figma: 284:11226 "Card header seach" (1280 × 81)
 *  - flex justify-between
 *  - title: text-lg 18/28 semibold
 *  - optional trailing slot — search input by default, or custom node via `trailing`.
 *  - Pass `searchPlaceholder={undefined}` (or `trailing={undefined}`) to hide trailing.
 */
import type { ReactNode } from "react";
import { SearchLgIcon } from "@/components/icons";

export type TableSectionHeaderProps = {
  title: string;
  /** Placeholder for the default search input. Pass `null` to hide search entirely. */
  searchPlaceholder?: string | null;
  /** Replace the trailing area with custom content (overrides searchPlaceholder). */
  trailing?: ReactNode;
};

export function TableSectionHeader({
  title,
  searchPlaceholder = "Search vehicles",
  trailing,
}: TableSectionHeaderProps) {
  const trailingContent =
    trailing !== undefined
      ? trailing
      : searchPlaceholder === null
        ? null
        : (
            <div className="flex items-center gap-md rounded-md border border-border-secondary bg-bg-primary px-[14px] py-[10px]">
              <SearchLgIcon className="h-5 w-5 text-fg-quaternary" />
              <input
                type="search"
                placeholder={searchPlaceholder}
                className="w-[240px] bg-transparent text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none"
              />
            </div>
          );

  return (
    <header className="flex items-center justify-between gap-xl px-3xl py-2xl">
      <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      {trailingContent}
    </header>
  );
}
