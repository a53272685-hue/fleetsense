"use client";

/**
 * Pagination — "Rows per page" selector + page links + Previous/Next buttons.
 * Figma: 273:6417 "Pagination"
 *  - h-68, flex justify-between, px-24 py-12
 *  - Left: "Rows per page: [10 ▾]"
 *  - Center: page numbers with current page highlighted
 *  - Right: Previous / Next buttons
 */
import { ChevronDownIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  rowsPerPage: number;
  onRowsPerPageChange: (n: number) => void;
}) {
  const pageNumbers = buildPageList(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between border-t border-border-secondary px-3xl py-lg">
      <div className="flex items-center gap-md text-sm text-text-secondary">
        <span>Rows per page:</span>
        <div className="flex items-center gap-xs rounded-md border border-border-secondary px-sm py-xs">
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="bg-transparent text-sm font-medium text-text-secondary focus:outline-none"
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="h-4 w-4 text-fg-quaternary" />
        </div>
      </div>

      <div className="flex items-center gap-sm">
        {pageNumbers.map((p, i) =>
          p === "…" ? (
            <span key={`e${i}`} className="px-sm text-sm text-text-tertiary">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={cn(
                "h-9 w-9 rounded-md text-sm font-medium",
                p === currentPage
                  ? "bg-bg-primary-hover text-text-secondary"
                  : "text-text-tertiary hover:bg-bg-primary-hover",
              )}
            >
              {p}
            </button>
          ),
        )}
      </div>

      <div className="flex items-center gap-md">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-xs rounded-md border border-border-secondary bg-bg-primary px-[14px] py-[10px] text-sm font-semibold text-text-secondary shadow-xs hover:bg-bg-primary-hover disabled:opacity-50"
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="inline-flex items-center gap-xs rounded-md border border-border-secondary bg-bg-primary px-[14px] py-[10px] text-sm font-semibold text-text-secondary shadow-xs hover:bg-bg-primary-hover disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

function buildPageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++)
    pages.push(i);
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}
