/**
 * MetricsCard — "Metrics basic A" component.
 * Figma: node 273:6119 (418 × 248)
 * Spec:
 *  - bg-primary (#fff), border border-secondary (#dcdfea) 1px
 *  - rounded-xl (12px), padding 24 (3xl), flex col gap-32 (4xl)
 *  - Heading row: KPI icon badge (38×38, brand-50 bg) + title (Inter 16/24 medium, text-tertiary) + dots menu
 *  - Value row: big number (display-sm 30/38 bold, text-primary) + trend Badge
 *  - Meta section: border-top border-secondary, pt-12 (lg), gap-8 (md)
 *    - 2 rows: label (sm medium text-tertiary) / value (sm semibold text-secondary)
 */
import type { ComponentType, SVGProps } from "react";
import {
  Download01Icon,
  File06Icon,
  Share04Icon,
} from "@/components/icons";
import { KpiIconBadge } from "./KpiIconBadge";
import { Badge } from "./Badge";
import { DotsMenu } from "./DotsMenu";

export type MetricsCardMetaItem = {
  label: string;
  value: string;
  /** `error` colors the value red (for loss $ amounts). */
  tone?: "default" | "error";
};

export type MetricsCardProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  iconTone?: "brand" | "success" | "warning" | "error" | "gray";
  title: string;
  value: string;
  trend?: { direction: "up" | "down"; value: string };
  meta?: MetricsCardMetaItem[];
};

export function MetricsCard({ icon, iconTone = "brand", title, value, trend, meta }: MetricsCardProps) {
  return (
    <article
      className="group flex flex-col gap-4xl rounded-xl border border-border-secondary bg-bg-primary p-3xl shadow-xs transition-[transform,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out-fast)] will-change-transform hover:-translate-y-px hover:shadow-lg"
    >
      {/* Heading row */}
      <header className="flex w-full items-center gap-lg">
        <KpiIconBadge icon={icon} tone={iconTone} />
        <p className="min-w-0 flex-1 text-base font-medium leading-6 text-text-tertiary">
          {title}
        </p>
        <DotsMenu
          ariaLabel={`${title} options`}
          items={[
            {
              label: "Download as CSV/Excel",
              icon: <Download01Icon className="h-4 w-4" />,
            },
            {
              label: "Export as PDF",
              icon: <File06Icon className="h-4 w-4" />,
            },
            {
              label: "Share via Link",
              icon: <Share04Icon className="h-4 w-4" />,
            },
          ]}
        />
      </header>

      {/* Value row */}
      <div className="flex w-full items-center justify-between">
        <p className="text-display-sm font-bold text-text-primary">{value}</p>
        {trend ? <Badge trend={trend.direction}>{trend.value}</Badge> : null}
      </div>

      {/* Meta section */}
      {meta && meta.length > 0 ? (
        <dl className="flex w-full flex-col gap-md border-t border-border-secondary pt-lg">
          {meta.map((m) => (
            <div key={m.label} className="flex items-center justify-between text-sm">
              <dt className="font-medium text-text-tertiary">{m.label}</dt>
              <dd
                className={
                  m.tone === "error"
                    ? "font-semibold text-text-error-primary"
                    : "font-semibold text-text-secondary"
                }
              >
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </article>
  );
}
