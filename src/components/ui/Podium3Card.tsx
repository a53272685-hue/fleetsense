/**
 * Podium3Card — 2nd / 1st / 3rd ranking podium card.
 * Figma: Deep Dive "Drivers" page top-left card (406:11422).
 *
 * Center pedestal (1st place) is taller with brand-blue gradient fill and
 * white text. Side pedestals (2nd, 3rd) are shorter with gray / pink tint.
 *
 * Each position shows:
 *   Avatar → Name → "Xnd/rd/st" rank → "points · $bonus"
 */
import { Avatar } from "./Avatar";
import { cn } from "@/lib/utils";

export type PodiumEntry = {
  name: string;
  initials: string;
  points: string; // "2,890 PTS"
  bonus: string; // "$87"
};

export function Podium3Card({
  first,
  second,
  third,
}: {
  first: PodiumEntry;
  second: PodiumEntry;
  third: PodiumEntry;
}) {
  return (
    <article className="flex items-end justify-center gap-sm rounded-xl border border-border-secondary bg-bg-primary p-3xl shadow-xs">
      <PodiumColumn
        entry={second}
        rank="2nd"
        height={160}
        variant="silver"
      />
      <PodiumColumn
        entry={first}
        rank="1st"
        height={220}
        variant="gold"
      />
      <PodiumColumn
        entry={third}
        rank="3rd"
        height={130}
        variant="bronze"
      />
    </article>
  );
}

function PodiumColumn({
  entry,
  rank,
  height,
  variant,
}: {
  entry: PodiumEntry;
  rank: "1st" | "2nd" | "3rd";
  height: number;
  variant: "gold" | "silver" | "bronze";
}) {
  // Pedestal backgrounds per Figma node 406:11422 (deep-dive/drivers podium).
  // Earlier code used one step lighter on both silver (#fafafa) and bronze
  // (error-50) which made the losers fade into the card bg, leaving gold
  // to read as the only distinct tone. Matching Figma's utility-gray-200
  // and utility-error-100 restores the 3-way color hierarchy.
  const pedestalColor = {
    gold: "bg-gradient-to-b from-[var(--utility-brand-500)] to-[var(--utility-brand-700)] text-white",
    silver: "bg-[var(--utility-gray-200)] text-text-primary",
    bronze: "bg-[var(--utility-error-100)] text-text-primary",
  }[variant];

  return (
    <div className="flex w-[180px] flex-col items-center">
      <Avatar
        initials={entry.initials}
        className="h-14 w-14 text-lg"
      />
      <p className="mt-md text-base font-semibold text-text-primary">
        {entry.name}
      </p>
      <div
        className={cn(
          "mt-md flex w-full flex-col items-center justify-end gap-xs rounded-t-xl px-md pb-md pt-lg",
          pedestalColor,
        )}
        style={{ height }}
      >
        <p className="text-display-sm font-bold leading-[38px]">{rank}</p>
        <p className="rounded-full bg-white/20 px-md py-xxs text-xs font-medium">
          {entry.points} · {entry.bonus}
        </p>
      </div>
    </div>
  );
}
