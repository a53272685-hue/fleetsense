/**
 * FileIconBadge — small rounded-square badge used in front of a form/file
 * name in tables. Figma /forms mocks show a 32×32 tinted rounded box behind
 * a 16×16 file glyph.
 *
 * Default: gray-100 bg + border-secondary border + fg-quaternary glyph.
 * `tone` can override for colored variants (Figma uses gray for most).
 */
import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/utils";

type Tone = "gray" | "brand" | "success" | "warning" | "error";

const TONE_BG: Record<Tone, string> = {
  gray: "bg-[var(--utility-gray-100)] text-fg-quaternary",
  brand:
    "bg-[var(--utility-brand-50)] text-[var(--utility-brand-600)]",
  success:
    "bg-[var(--utility-success-50)] text-[var(--utility-success-700)]",
  warning:
    "bg-[var(--utility-warning-50)] text-[var(--utility-warning-700)]",
  error:
    "bg-[var(--utility-error-50)] text-[var(--utility-error-700)]",
};

export function FileIconBadge({
  icon: Icon,
  tone = "gray",
  className,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-border-secondary",
        TONE_BG[tone],
        className,
      )}
    >
      <Icon className="h-4 w-4" />
    </span>
  );
}
