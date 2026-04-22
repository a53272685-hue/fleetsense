"use client";

/**
 * FleetVehiclesTable — "Fleet Vehicles" listing table.
 * Figma: node 273:6384 "TableSection" (rows 273:6407-6416)
 *
 * Columns (widths from Figma cell specs):
 *  1. Vehicle (170px) — Avatar + two-line name/model
 *  2. Utilization (200px) — ProgressBar + percentage text
 *  3. Status (85px) — StatusPill (no column header per Figma)
 *  4. Distance (103.125px)
 *  5. Trips (103.125px)
 *  6. Days used (103.125px)
 *  7. Driving Hours (103.125px)
 *  8. Idle Hours (103.125px)
 *  9. Fuel(L) (103.125px)
 * 10. MPG (103.125px) — NumberBadge
 * 11. Detail (~50px) — right chevron
 */
import { useRouter } from "next/navigation";
import {
  Avatar,
  ProgressBar,
  StatusPill,
  NumberBadge,
  type StatusTone,
  type NumberBadgeTone,
} from "@/components/ui";
import { TableHeader, TableCell, TableRow } from "./";
import { ChevronDownIcon } from "@/components/icons";

export type FleetVehicleRow = {
  id: string;
  code: string; // e.g. "F1"
  name: string; // e.g. "Fleet-101"
  model: string; // e.g. "Ford Transit"
  utilizationPct: number;
  status: { label: string; tone: StatusTone };
  distanceKm: number;
  trips: number;
  daysUsed: string; // "13/14"
  drivingHoursLabel: string; // Figma shows "189L" literal — keep string
  idleHours: string; // "0.3 h"
  fuelL: string; // "204L"
  mpg: { value: string; tone: NumberBadgeTone };
};

export function FleetVehiclesTable({ rows }: { rows: FleetVehicleRow[] }) {
  const router = useRouter();
  // narrow numeric columns get tighter horizontal padding so all 11 columns
  // fit within the 1280px page container without horizontal scroll
  const narrowPad = "!px-lg";
  return (
    <div className="w-full">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr>
            <TableHeader className="w-[170px]">Vehicle</TableHeader>
            <TableHeader className="w-[200px]">Utilization</TableHeader>
            <TableHeader className="w-[80px] !px-sm">
              <span className="sr-only">Status</span>
            </TableHeader>
            <TableHeader className={`w-[92px] ${narrowPad}`}>Distance</TableHeader>
            <TableHeader className={`w-[64px] ${narrowPad}`}>Trips</TableHeader>
            <TableHeader className={`w-[92px] ${narrowPad}`}>Days used</TableHeader>
            <TableHeader className={`w-[112px] ${narrowPad}`}>Driving Hours</TableHeader>
            <TableHeader className={`w-[92px] ${narrowPad}`}>Idle Hours</TableHeader>
            <TableHeader className={`w-[80px] ${narrowPad}`}>Fuel(L)</TableHeader>
            <TableHeader className={`w-[72px] ${narrowPad}`}>MPG</TableHeader>
            <TableHeader className="w-[48px] !px-sm">
              <span className="sr-only">Detail</span>
            </TableHeader>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <TableRow
              key={r.id}
              interactive
              onClick={() =>
                router.push(`/utilization/vehicle-deep-dive/${r.id}`)
              }
              aria-label={`Open vehicle ${r.name} detail`}
            >
              <TableCell>
                <div className="flex items-center gap-lg">
                  <Avatar initials={r.code} />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-text-primary">
                      {r.name}
                    </span>
                    <span className="text-sm font-normal text-text-tertiary">
                      {r.model}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-lg">
                  <ProgressBar value={r.utilizationPct} />
                  <span className="text-sm font-medium text-text-secondary whitespace-nowrap">
                    {r.utilizationPct}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="!px-sm">
                <StatusPill tone={r.status.tone}>{r.status.label}</StatusPill>
              </TableCell>
              <TableCell className={`${narrowPad} text-sm font-normal text-text-tertiary`}>
                {r.distanceKm.toLocaleString()} km
              </TableCell>
              <TableCell className={`${narrowPad} text-sm font-normal text-text-tertiary`}>
                {r.trips}
              </TableCell>
              <TableCell className={`${narrowPad} text-sm font-normal text-text-tertiary`}>
                {r.daysUsed}
              </TableCell>
              <TableCell className={`${narrowPad} text-sm font-normal text-text-tertiary`}>
                {r.drivingHoursLabel}
              </TableCell>
              <TableCell className={`${narrowPad} text-sm font-normal text-text-tertiary`}>
                {r.idleHours}
              </TableCell>
              <TableCell className={`${narrowPad} text-sm font-normal text-text-tertiary`}>
                {r.fuelL}
              </TableCell>
              <TableCell className={narrowPad}>
                <NumberBadge tone={r.mpg.tone}>{r.mpg.value}</NumberBadge>
              </TableCell>
              <TableCell className="!px-sm">
                <ChevronDownIcon className="h-5 w-5 -rotate-90 text-fg-quaternary" />
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </table>
    </div>
  );
}
