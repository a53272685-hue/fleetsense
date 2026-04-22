/**
 * DriverInfoCard — header card on /efficiency/driver-deep-dive/[id].
 * Figma: "Selected Driver Report" block (303:17605 sub-frame).
 *
 * Layout:
 *  - Left wide card: avatar + name + role/region subtitle + vehicle tags
 *  - Right narrower card: Efficiency Score big value + trend
 */
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { InfoIcon } from "@/components/icons";

export type DriverInfoCardProps = {
  initials: string;
  name: string;
  /** e.g. "Delivery Driver · North Region" */
  subtitle: string;
  /** Tag chips to the right of the name (e.g. ["Truck 006", "Van 006"]). */
  tags?: string[];
  score: {
    value: string; // e.g. "92%"
    trend?: { direction: "up" | "down"; value: string };
  };
};

export function DriverInfoCard({
  initials,
  name,
  subtitle,
  tags,
  score,
}: DriverInfoCardProps) {
  return (
    <div className="grid grid-cols-[1fr_320px] gap-lg">
      {/* Driver info card */}
      <article className="flex items-center gap-lg rounded-xl border border-border-secondary bg-bg-primary p-3xl shadow-xs">
        <Avatar initials={initials} className="h-12 w-12 text-lg" />
        <div className="flex min-w-0 flex-1 flex-col gap-xs">
          <h2 className="text-xl font-semibold leading-[30px] text-text-primary">
            {name}
          </h2>
          <p className="text-base leading-6 text-text-tertiary">{subtitle}</p>
        </div>
        {tags && tags.length > 0 ? (
          <div className="flex shrink-0 items-center gap-sm">
            {tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full border border-border-secondary bg-bg-secondary px-md py-xs text-sm font-medium text-text-secondary"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </article>

      {/* Efficiency Score card */}
      <article className="flex flex-col gap-lg rounded-xl border border-border-secondary bg-bg-primary p-3xl shadow-xs">
        <div className="flex items-start justify-between">
          <p className="text-base font-medium leading-6 text-text-tertiary">
            Efficiency Score
          </p>
          <InfoIcon className="h-5 w-5 text-fg-quaternary" />
        </div>
        <div className="flex items-center gap-md">
          <p className="text-display-sm font-bold leading-[38px] text-text-primary">
            {score.value}
          </p>
          {score.trend ? (
            <Badge trend={score.trend.direction}>{score.trend.value}</Badge>
          ) : null}
        </div>
      </article>
    </div>
  );
}
