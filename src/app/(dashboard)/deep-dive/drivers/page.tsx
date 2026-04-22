"use client";

import { useState } from "react";
import {
  PageHeader,
  FilterChip,
  Podium3Card,
  Avatar,
  ProgressBar,
  StatusPill,
  TableSectionHeader,
  Pagination,
  Badge,
} from "@/components/ui";
import {
  TableHeader,
  TableCell,
  TableRow,
} from "@/components/tables";
import {
  ChevronDownIcon,
  CalendarIcon,
  FilterLinesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  KpiSmErrorIcon,
} from "@/components/icons";

type LeaderRow = {
  id: string;
  rank: number;
  rankDelta: { direction: "up" | "down"; value: number };
  initials: string;
  name: string;
  vehicleModel: string;
  score: number;
  improvement: string;
  safetyScore: string;
  currentVehicle: string;
};

const leaderRows: LeaderRow[] = [
  { id: "1", rank: 1, rankDelta: { direction: "up", value: 2 }, initials: "JM", name: "John Martinez", vehicleModel: "Freightliner M2", score: 92, improvement: "+8%", safetyScore: "95%", currentVehicle: "Fleet-101" },
  { id: "2", rank: 2, rankDelta: { direction: "down", value: 2 }, initials: "PS", name: "Priya Sandhu", vehicleModel: "Kenworth T680", score: 88, improvement: "+12%", safetyScore: "91%", currentVehicle: "Fleet-087" },
  { id: "3", rank: 3, rankDelta: { direction: "down", value: 2 }, initials: "DO", name: "Derek Okafor", vehicleModel: "Peterbilt 579", score: 85, improvement: "+5%", safetyScore: "88%", currentVehicle: "Fleet-204" },
  { id: "4", rank: 4, rankDelta: { direction: "up", value: 2 }, initials: "LH", name: "Luis Hernandez", vehicleModel: "Volvo VNL 860", score: 81, improvement: "+15%", safetyScore: "83%", currentVehicle: "Fleet-155" },
  { id: "5", rank: 5, rankDelta: { direction: "up", value: 2 }, initials: "AP", name: "Anika Patel", vehicleModel: "International LT", score: 78, improvement: "+3%", safetyScore: "79%", currentVehicle: "Fleet-312" },
];

type AttentionRow = {
  id: string;
  initials: string;
  name: string;
  model: string;
  score: number;
  improvement: string;
  safetyScore: string;
  vehicle: string;
};

const attentionRows: AttentionRow[] = [
  { id: "1", initials: "SC", name: "Sarah Chen", model: "Ford E-Transit", score: 62, improvement: "-4%", safetyScore: "58%", vehicle: "Fleet-443" },
  { id: "2", initials: "NK", name: "Nadia Kowalski", model: "RAM ProMaster", score: 55, improvement: "-8%", safetyScore: "52%", vehicle: "Fleet-067" },
  { id: "3", initials: "CR", name: "Carlos Rivera", model: "Chevrolet Express", score: 48, improvement: "-12%", safetyScore: "45%", vehicle: "Fleet-289" },
];

/**
 * Map a "92%" / "58%" safety score string to an appropriate StatusPill
 * tone. Higher is better — so ≥80% reads as success (risk-low green),
 * 70–79% as warning, <70% as danger.
 */
function safetyTone(score: string): "risk-low" | "risk-medium" | "risk-high" {
  const n = parseFloat(score);
  if (Number.isNaN(n)) return "risk-medium";
  if (n >= 80) return "risk-low";
  if (n >= 70) return "risk-medium";
  return "risk-high";
}

export default function DeepDiveDriversPage() {
  const enter = "fs-animate-enter";
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4xl">
      <div className={enter} style={{ animationDelay: "0ms" }}>
        <PageHeader
          title="Driver Performance Deep Dive"
          actions={
            <div className="flex items-center gap-lg">
              <div className="flex">
                <FilterChip segment="left" rightIcon={ChevronDownIcon}>
                  Last 7 days
                </FilterChip>
                <FilterChip segment="right" leftIcon={CalendarIcon}>
                  Jan 1 – Jan 7
                </FilterChip>
              </div>
              <FilterChip leftIcon={FilterLinesIcon}>Filters</FilterChip>
            </div>
          }
        />
      </div>

      {/* Podium + 2 summary cards */}
      <section
        className={`${enter} grid grid-cols-[1fr_420px] gap-lg`}
        style={{ animationDelay: "60ms" }}
      >
        <Podium3Card
          first={{ name: "Carlos R.", initials: "CR", points: "3,120 PTS", bonus: "$96" }}
          second={{ name: "Priya S.", initials: "PS", points: "2,890 PTS", bonus: "$87" }}
          third={{ name: "James W.", initials: "JW", points: "2,540 PTS", bonus: "$76" }}
        />
        {/* justify-between distributes the 2 right-side cards so their top
            + bottom edges align with the Podium card — no extra empty
            space below the "Attention Required" card. */}
        <div className="flex flex-col justify-between">
          <article className="flex flex-col gap-md rounded-xl border border-border-secondary bg-bg-primary p-3xl shadow-xs">
            <p className="text-sm font-medium text-text-tertiary">
              Most Improved Driver
            </p>
            <div className="flex items-center justify-center">
              <Avatar initials="JD" className="h-10 w-10" />
            </div>
            <p className="text-center text-xl font-semibold text-text-primary">
              Jordan Lee
            </p>
            <p className="text-center text-sm text-text-tertiary">
              Efficiency Score: 78
            </p>
            <div className="flex items-center justify-center">
              <Badge trend="up">18%</Badge>
            </div>
          </article>
          <article className="flex flex-col gap-md rounded-xl border border-border-secondary bg-bg-primary p-3xl shadow-xs">
            <div className="flex items-center gap-md">
              <KpiSmErrorIcon className="h-5 w-5 text-[var(--utility-error-500)]" />
              <p className="text-sm font-medium text-text-tertiary">
                Attention Required Drivers
              </p>
            </div>
            <p className="text-display-sm font-bold leading-[38px] text-text-primary">
              9
            </p>
          </article>
        </div>
      </section>

      {/* Driver Performance Leaderboard */}
      <section
        className={`${enter} overflow-hidden rounded-xl border border-border-secondary bg-bg-primary`}
        style={{ animationDelay: "120ms" }}
      >
        <TableSectionHeader
          title="Driver Performance Leaderboard"
          searchPlaceholder="Search drivers"
        />
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr>
              <TableHeader className="w-[100px] !px-lg">Rank</TableHeader>
              <TableHeader className="w-[240px]">Driver</TableHeader>
              <TableHeader className="w-[260px]">Efficiency Score</TableHeader>
              <TableHeader className="w-[140px] !px-lg">Improvement</TableHeader>
              <TableHeader className="w-[140px] !px-lg">Safety Score</TableHeader>
              <TableHeader>Current Vehicle</TableHeader>
              <TableHeader className="w-[120px] !px-sm">
                <span className="sr-only">Action</span>
              </TableHeader>
            </tr>
          </thead>
          <tbody>
            {leaderRows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="!px-lg">
                  <div className="flex items-center gap-sm">
                    {r.rankDelta.direction === "up" ? (
                      <span className="inline-flex items-center gap-xxs text-xs font-medium text-text-success-primary">
                        <ArrowUpIcon className="h-3 w-3" />
                        {r.rankDelta.value}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-xxs text-xs font-medium text-text-error-primary">
                        <ArrowDownIcon className="h-3 w-3" />
                        {r.rankDelta.value}
                      </span>
                    )}
                    <span className="text-sm font-semibold text-text-primary">
                      {r.rank}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-md">
                    <Avatar initials={r.initials} />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-text-primary">
                        {r.name}
                      </span>
                      <span className="text-sm text-text-tertiary">
                        {r.vehicleModel}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-md">
                    <ProgressBar
                      value={r.score}
                      size="lg"
                      label={`${r.name} safety score`}
                    />
                    <span className="text-sm font-medium text-text-secondary">
                      {r.score}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="!px-lg">
                  <span className="inline-flex items-center gap-xxs text-sm font-medium text-text-success-primary">
                    <ArrowUpIcon className="h-3 w-3" />
                    {r.improvement.replace("+", "")}
                  </span>
                </TableCell>
                <TableCell className="!px-lg">
                  <StatusPill tone={safetyTone(r.safetyScore)}>
                    {r.safetyScore}
                  </StatusPill>
                </TableCell>
                <TableCell className="text-text-tertiary">
                  {r.currentVehicle}
                </TableCell>
                <TableCell className="!px-sm">
                  <button
                    type="button"
                    className="rounded-md border border-border-secondary bg-bg-primary px-md py-xs text-xs font-semibold text-text-secondary shadow-xs hover:bg-bg-primary-hover"
                  >
                    View Profile
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      </section>

      {/* Attention Required Drivers */}
      <section
        className={`${enter} overflow-hidden rounded-xl border border-border-secondary bg-bg-primary`}
        style={{ animationDelay: "180ms" }}
      >
        <header className="flex items-center justify-between gap-xl px-3xl py-2xl">
          <div className="flex flex-col gap-xs">
            <h2 className="text-lg font-semibold text-text-primary">
              Attention Required Drivers{" "}
              <span className="text-text-tertiary">(3)</span>
            </h2>
            <p className="text-sm text-text-tertiary">
              Drivers with an Efficiency Score below 70%.
            </p>
          </div>
        </header>
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr>
              <TableHeader className="w-[240px]">Driver</TableHeader>
              <TableHeader className="w-[260px]">Efficiency Score</TableHeader>
              <TableHeader className="w-[140px] !px-lg">Improvement</TableHeader>
              <TableHeader className="w-[140px] !px-lg">Safety Score</TableHeader>
              <TableHeader>Current Vehicle</TableHeader>
              <TableHeader className="w-[120px] !px-sm">
                <span className="sr-only">Action</span>
              </TableHeader>
            </tr>
          </thead>
          <tbody>
            {attentionRows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="flex items-center gap-md">
                    <Avatar initials={r.initials} />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-text-primary">
                        {r.name}
                      </span>
                      <span className="text-sm text-text-tertiary">
                        {r.model}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-md">
                    <div className="h-2 flex-1 rounded-full bg-bg-secondary">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${r.score}%`,
                          backgroundColor: "var(--utility-error-500)",
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-text-secondary">
                      {r.score}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="!px-lg font-medium text-text-error-primary">
                  <span className="inline-flex items-center gap-xxs">
                    <ArrowDownIcon className="h-3 w-3" />
                    {r.improvement.replace("-", "")}
                  </span>
                </TableCell>
                <TableCell className="!px-lg">
                  <StatusPill tone={safetyTone(r.safetyScore)}>
                    {r.safetyScore}
                  </StatusPill>
                </TableCell>
                <TableCell className="text-text-tertiary">{r.vehicle}</TableCell>
                <TableCell className="!px-sm">
                  <button
                    type="button"
                    className="rounded-md border border-border-secondary bg-bg-primary px-md py-xs text-xs font-semibold text-text-secondary shadow-xs hover:bg-bg-primary-hover"
                  >
                    View Profile
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      </section>

    </div>
  );
}
