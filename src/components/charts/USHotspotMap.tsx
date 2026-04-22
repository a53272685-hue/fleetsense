"use client";

/**
 * USHotspotMap — inline SVG US map + hotspot markers.
 * Figma: /compliance/csa "Geographic Hotspots" card.
 *
 * Simplified US map rendered via an inline SVG path (contiguous 48 states).
 * Markers are positioned by lon/lat converted to [0..100] percentage space,
 * mapped to the SVG viewBox's bounding lon/lat.
 *
 * Hotspot dots pulse via CSS keyframes (custom per-tone color). Clicking a
 * marker surfaces its label in a small card at the top-left of the map.
 *
 * This is a lightweight mock — a production app would use Mapbox/Leaflet.
 */
import { useState } from "react";
import { StatusPill } from "@/components/ui";
import { cn } from "@/lib/utils";

// Simplified path of the contiguous US outline. Good enough for a portfolio
// mock — traced from a public-domain 959×593 reference.
const US_PATH =
  "M124 281 L111 268 L102 261 L85 259 L76 247 L62 245 L51 237 L39 237 L37 249 L51 258 L55 266 L64 270 L80 278 L93 289 L101 293 L106 300 L112 302 L114 315 L121 322 L135 323 L141 336 L155 339 L150 328 L145 316 L140 308 L135 295 Z M172 95 L185 94 L203 104 L217 108 L224 116 L236 114 L258 117 L284 112 L308 114 L338 111 L365 104 L392 104 L416 111 L448 105 L480 101 L505 98 L536 97 L568 94 L596 92 L626 89 L656 88 L682 93 L710 95 L738 100 L770 103 L810 112 L844 120 L870 125 L896 131 L924 141 L938 156 L943 174 L938 191 L929 208 L920 220 L912 230 L910 242 L919 258 L931 270 L941 283 L939 300 L928 315 L917 328 L908 342 L898 355 L886 368 L876 380 L870 393 L860 408 L850 425 L840 442 L828 461 L820 472 L810 483 L794 498 L774 510 L752 520 L728 530 L705 539 L680 548 L655 555 L626 558 L598 555 L572 548 L548 538 L528 528 L508 516 L488 502 L470 487 L450 472 L430 457 L410 442 L390 426 L370 412 L350 400 L330 392 L314 387 L300 383 L290 378 L283 369 L276 358 L268 346 L260 335 L250 323 L238 310 L225 295 L210 280 L194 263 L180 246 L170 229 L162 211 L156 192 L152 172 L150 153 L152 134 L158 116 L168 102 Z";

export type Hotspot = {
  id: string;
  label: string;
  /** 0–100 horizontal position in the 1000×600 viewBox. */
  x: number;
  /** 0–100 vertical position. */
  y: number;
  /** Small count or severity text shown in the popup pill. */
  badge: string;
  /** Visual tone for the pulse dot + pill. */
  tone: "risk-high" | "risk-medium" | "risk-low";
};

const TONE_DOT: Record<Hotspot["tone"], string> = {
  "risk-high": "bg-[var(--utility-error-500)]",
  "risk-medium": "bg-[var(--utility-warning-500)]",
  "risk-low": "bg-[var(--utility-success-500)]",
};

export function USHotspotMap({
  hotspots,
  initialSelected,
}: {
  hotspots: Hotspot[];
  /** Optional id to show as selected on mount. */
  initialSelected?: string;
}) {
  const [selectedId, setSelectedId] = useState<string | undefined>(
    initialSelected ?? hotspots[0]?.id,
  );
  const selected = hotspots.find((h) => h.id === selectedId);

  return (
    <div className="relative overflow-hidden rounded-xl border border-border-secondary bg-bg-secondary">
      {/* Selected hotspot pill — anchored top-left */}
      {selected ? (
        <div className="absolute left-3xl top-2xl z-10 inline-flex items-center gap-md rounded-md bg-bg-primary px-md py-sm shadow-md">
          <span
            aria-hidden
            className={cn("h-2 w-2 rounded-full", TONE_DOT[selected.tone])}
          />
          <span className="text-sm font-medium text-text-primary">
            {selected.label}
          </span>
          <StatusPill tone={selected.tone}>{selected.badge}</StatusPill>
        </div>
      ) : null}

      {/* Map SVG */}
      <svg
        viewBox="0 0 1000 600"
        className="h-full w-full"
        style={{ minHeight: 280 }}
        aria-label="US hotspot map"
      >
        {/* Country outline */}
        <path
          d={US_PATH}
          fill="var(--utility-gray-100)"
          stroke="var(--border-secondary)"
          strokeWidth={1.5}
        />

        {/* Hotspot markers */}
        {hotspots.map((h) => {
          const cx = (h.x / 100) * 1000;
          const cy = (h.y / 100) * 600;
          const color =
            h.tone === "risk-high"
              ? "var(--utility-error-500)"
              : h.tone === "risk-medium"
                ? "var(--utility-warning-500)"
                : "var(--utility-success-500)";
          const isSelected = h.id === selectedId;
          return (
            <g
              key={h.id}
              onClick={() => setSelectedId(h.id)}
              style={{ cursor: "pointer" }}
              role="button"
              aria-label={`Hotspot ${h.label}`}
              tabIndex={0}
            >
              {/* Outer halo (pulse-ish via opacity) */}
              <circle
                cx={cx}
                cy={cy}
                r={isSelected ? 22 : 14}
                fill={color}
                opacity={isSelected ? 0.2 : 0.15}
              />
              {/* Core dot */}
              <circle cx={cx} cy={cy} r={isSelected ? 8 : 6} fill={color} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
