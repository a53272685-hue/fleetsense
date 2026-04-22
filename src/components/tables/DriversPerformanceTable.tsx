"use client";

/**
 * DriversPerformanceTable — "Drivers Performance" listing on
 * /efficiency/overview. Based on FleetVehiclesTable but for drivers.
 *
 * Columns:
 *   Company (avatar + name/location) · Score (bar + %) · Status pill ·
 *   Miles · Idle Score (red %) · Speed Score · RPM Score · Cruise Score · chevron
 */
import { useRouter } from "next/navigation";
import {
  Avatar,
  ProgressBar,
  StatusPill,
  type StatusTone,
} from "@/components/ui";
import { TableHeader, TableCell, TableRow } from "./";
import { ChevronDownIcon } from "@/components/icons";

export type DriverRow = {
  id: string;
  initials: string;
  name: string;
  location: string;
  scorePct: number;
  status: { label: string; tone: StatusTone };
  miles: number;
  idleScorePct: string;
  speedScorePct: string;
  rpmScore: string;
  cruiseScorePct: string;
};

export function DriversPerformanceTable({ rows }: { rows: DriverRow[] }) {
  const router = useRouter();
  const narrowPad = "!px-lg";
  return (
    <div className="w-full">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr>
            <TableHeader className="w-[180px]">Company</TableHeader>
            <TableHeader className="w-[200px]">Score</TableHeader>
            <TableHeader className="w-[80px] !px-sm">
              <span className="sr-only">Status</span>
            </TableHeader>
            <TableHeader className={`w-[80px] ${narrowPad}`}>Miles</TableHeader>
            <TableHeader className={`w-[96px] ${narrowPad}`}>Idle Score</TableHeader>
            <TableHeader className={`w-[100px] ${narrowPad}`}>Speed Score</TableHeader>
            <TableHeader className={`w-[92px] ${narrowPad}`}>RPM Score</TableHeader>
            <TableHeader className={`w-[100px] ${narrowPad}`}>Cruise Score</TableHeader>
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
                router.push(`/efficiency/driver-deep-dive/${r.id}`)
              }
              aria-label={`Open driver ${r.name} detail`}
            >
              <TableCell>
                <div className="flex items-center gap-lg">
                  <Avatar initials={r.initials} />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-text-primary">
                      {r.name}
                    </span>
                    <span className="text-sm font-normal text-text-tertiary">
                      {r.location}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-lg">
                  <ProgressBar
                    value={r.scorePct}
                    label={`${r.name} performance score`}
                  />
                  <span className="text-sm font-medium text-text-secondary whitespace-nowrap">
                    {r.scorePct}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="!px-sm">
                <StatusPill tone={r.status.tone}>{r.status.label}</StatusPill>
              </TableCell>
              <TableCell
                className={`${narrowPad} text-sm font-normal text-text-tertiary`}
              >
                {r.miles.toLocaleString()}
              </TableCell>
              {/* Idle Score rendered red per Figma (indicates wasted time). */}
              <TableCell
                className={`${narrowPad} text-sm font-semibold text-text-error-primary`}
              >
                {r.idleScorePct}
              </TableCell>
              <TableCell
                className={`${narrowPad} text-sm font-normal text-text-tertiary`}
              >
                {r.speedScorePct}
              </TableCell>
              <TableCell
                className={`${narrowPad} text-sm font-normal text-text-tertiary`}
              >
                {r.rpmScore}
              </TableCell>
              <TableCell
                className={`${narrowPad} text-sm font-normal text-text-tertiary`}
              >
                {r.cruiseScorePct}
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
