/**
 * TableSectionHeader — "Fleet Vehicles" card header with search bar.
 * Figma: 284:11226 "Card header seach" (1280 × 81)
 *  - flex justify-between
 *  - title: text-lg 18/28 semibold
 *  - search: input with search icon, rounded-md border
 */
import { SearchLgIcon } from "@/components/icons";

export function TableSectionHeader({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between gap-xl px-3xl py-2xl">
      <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      <div className="flex items-center gap-md rounded-md border border-border-secondary bg-bg-primary px-[14px] py-[10px]">
        <SearchLgIcon className="h-5 w-5 text-fg-quaternary" />
        <input
          type="search"
          placeholder="Search vehicles"
          className="w-[240px] bg-transparent text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none"
        />
      </div>
    </header>
  );
}
