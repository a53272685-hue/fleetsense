/**
 * AlertBanner — dismissible-style banner used at the top of pages.
 * Figma: node 2149:11702 "Alert_Banner" (1280 × 44)
 * Spec:
 *  - bg error-50 (#fef3f2), border error-200 (#fecdca) 1px
 *  - rounded 8px
 *  - px-16 (xl) py-12 (lg)
 *  - left: 8px dot (error-600) + Inter medium 13px/20px, color error-700 (#b42318)
 *  - right: Inter semibold 13px/20px same color, literal "→" character
 *  - font size 13px is arbitrary — Figma spec value (no Tailwind token at 13).
 */
import type { ReactNode } from "react";

export type AlertBannerProps = {
  children: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
};

export function AlertBanner({ children, actionLabel, onAction }: AlertBannerProps) {
  return (
    <div className="flex h-[44px] items-center justify-between rounded-lg border border-error-200 bg-error-50 px-xl py-lg">
      <div className="flex items-center gap-md overflow-hidden">
        <span
          aria-hidden
          className="inline-block h-2 w-2 shrink-0 rounded-full bg-error-600"
        />
        <p className="truncate text-[13px] font-medium leading-5 text-error-700">
          {children}
        </p>
      </div>
      {actionLabel ? (
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 text-[13px] font-semibold leading-5 text-error-700 hover:underline"
        >
          {actionLabel} →
        </button>
      ) : null}
    </div>
  );
}
