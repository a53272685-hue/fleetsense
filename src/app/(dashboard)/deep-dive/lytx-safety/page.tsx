"use client";

import { useState } from "react";
import {
  PageHeader,
  FilterChip,
  StatusPill,
  Avatar,
  Pagination,
  type StatusTone,
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
  SearchLgIcon,
} from "@/components/icons";

type LytxRow = {
  id: string;
  date: string;
  trigger: { label: string; tone: StatusTone };
  behavior: string;
  vehicle: string;
  initials: string;
  driver: string;
  match: string;
  status: { label: string; tone: StatusTone };
};

const rows: LytxRow[] = [
  { id: "1", date: "Mar 3, 2026, 3:00 pm", trigger: { label: "Hard Brake", tone: "risk-high" }, behavior: "Aggressive", vehicle: "Fleet-101", initials: "JM", driver: "John Martinez", match: "1FTBW2CM8J", status: { label: "New", tone: "new" } },
  { id: "2", date: "Mar 3, 2026, 2:30 pm", trigger: { label: "Distraction", tone: "coaching" }, behavior: "Phone Use", vehicle: "Fleet-087", initials: "PS", driver: "Priya Sandhu", match: "3C6UR5DJ0LG5", status: { label: "In Review", tone: "in-review" } },
  { id: "3", date: "Mar 3, 2026, 2:30 pm", trigger: { label: "Speeding", tone: "risk-medium" }, behavior: "Over Speed", vehicle: "Fleet-204", initials: "DO", driver: "Derek Okafor", match: "2HGES16575H9", status: { label: "Coaching", tone: "coaching" } },
  { id: "4", date: "Mar 3, 2026, 11:05 am", trigger: { label: "FLEX Smart Trigger", tone: "brand" }, behavior: "Lane Depart", vehicle: "Fleet-155", initials: "LH", driver: "Luis Hernandez", match: "No VIN", status: { label: "Resolved", tone: "resolved" } },
  { id: "5", date: "Mar 2, 2026, 4:18 pm", trigger: { label: "Collision", tone: "risk-high" }, behavior: "Rear-End C", vehicle: "Fleet-312", initials: "AP", driver: "Anika Patel", match: "1GCGG", status: { label: "New", tone: "new" } },
  { id: "6", date: "Mar 2, 2026, 10:55 am", trigger: { label: "Rolling Stop", tone: "risk-medium" }, behavior: "Stop Sign V", vehicle: "Fleet-443", initials: "SC", driver: "Sarah Chen", match: "5TDKK3DC", status: { label: "Coaching", tone: "coaching" } },
  { id: "7", date: "Mar 1, 2026, 3:28 pm", trigger: { label: "Drowsiness", tone: "coaching" }, behavior: "Eyes Close", vehicle: "Fleet-067", initials: "JW", driver: "James Whitfield", match: "No VIN", status: { label: "New", tone: "new" } },
  { id: "8", date: "Mar 1, 2026, 7:10 am", trigger: { label: "Following Distance", tone: "risk-medium" }, behavior: "Tailgating", vehicle: "Fleet-289", initials: "NK", driver: "Nadia Kowalski", match: "2GCEK19T7512", status: { label: "In Review", tone: "in-review" } },
  { id: "9", date: "Feb 28, 2026, 5:45 pm", trigger: { label: "Hard Brake", tone: "risk-high" }, behavior: "Sudden St", vehicle: "Fleet-518", initials: "EJ", driver: "Emma Johnson", match: "1GCHK23D45", status: { label: "Resolved", tone: "resolved" } },
  { id: "10", date: "Feb 28, 2026, 1:22 pm", trigger: { label: "Distraction", tone: "coaching" }, behavior: "Not Watchi", vehicle: "Fleet-033", initials: "CR", driver: "Carlos Rivera", match: "3GNAL2EK", status: { label: "New", tone: "new" } },
];

const SIDE_FILTERS = [
  { label: "New", count: 6, tone: "new" as StatusTone },
  { label: "In Review", count: 2, tone: "in-review" as StatusTone },
  { label: "Coaching", count: 6, tone: "coaching" as StatusTone },
  { label: "Resolved", count: 6, tone: "resolved" as StatusTone },
];

export default function DeepDiveLytxPage() {
  const enter = "fs-animate-enter";
  const [filter, setFilter] = useState<string>("In Review");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4xl">
      <div className={enter} style={{ animationDelay: "0ms" }}>
        <PageHeader
          title="Lytx Safety Events"
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

      {/* Filter row */}
      <div
        className={`${enter} flex items-center justify-between gap-md`}
        style={{ animationDelay: "60ms" }}
      >
        <div className="flex items-center gap-md">
          <FilterChip rightIcon={ChevronDownIcon}>Status</FilterChip>
          <div className="flex">
            <FilterChip segment="left" rightIcon={ChevronDownIcon}>
              Last 7 days
            </FilterChip>
            <FilterChip segment="right" leftIcon={CalendarIcon}>
              Jan 1 – Jan 7
            </FilterChip>
          </div>
        </div>
        <div className="flex items-center gap-md rounded-md border border-border-secondary bg-bg-primary px-[14px] py-[10px]">
          <SearchLgIcon className="h-5 w-5 text-fg-quaternary" />
          <input
            type="search"
            placeholder="Search"
            className="w-[240px] bg-transparent text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none"
          />
        </div>
      </div>

      {/* Events table with side filter */}
      <section
        className={`${enter} overflow-hidden rounded-xl border border-border-secondary bg-bg-primary`}
        style={{ animationDelay: "120ms" }}
      >
        <div className="grid grid-cols-[180px_1fr]">
          <ul className="flex flex-col gap-xs border-r border-border-secondary p-md">
            {SIDE_FILTERS.map((f) => (
              <li key={f.label}>
                <button
                  type="button"
                  onClick={() => setFilter(f.label)}
                  aria-pressed={filter === f.label}
                  className={
                    "flex w-full items-center justify-between rounded-md px-md py-sm text-sm font-medium transition-colors duration-[var(--duration-fast)] " +
                    (filter === f.label
                      ? "bg-bg-primary-hover text-text-primary"
                      : "text-text-tertiary hover:bg-bg-primary-hover")
                  }
                >
                  <span className="inline-flex items-center gap-sm">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor:
                          f.tone === "new"
                            ? "var(--utility-brand-500)"
                            : f.tone === "in-review"
                              ? "var(--utility-brand-500)"
                              : f.tone === "coaching"
                                ? "var(--utility-purple-500)"
                                : "var(--utility-gray-500)",
                      }}
                    />
                    {f.label}
                  </span>
                  <span className="text-xs text-text-quaternary">{f.count}</span>
                </button>
              </li>
            ))}
          </ul>
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr>
                <TableHeader className="w-[180px]">Date</TableHeader>
                <TableHeader className="w-[160px]">Trigger</TableHeader>
                <TableHeader className="w-[120px]">Behavior</TableHeader>
                <TableHeader className="w-[100px]">Vehicle</TableHeader>
                <TableHeader>Driver</TableHeader>
                <TableHeader className="w-[140px]">Match</TableHeader>
                <TableHeader className="w-[120px]">Status</TableHeader>
                <TableHeader className="w-[88px] !px-sm">
                  <span className="sr-only">Play</span>
                </TableHeader>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="text-text-tertiary">{r.date}</TableCell>
                  <TableCell>
                    <StatusPill tone={r.trigger.tone}>{r.trigger.label}</StatusPill>
                  </TableCell>
                  <TableCell className="text-text-tertiary">{r.behavior}</TableCell>
                  <TableCell className="text-text-tertiary">{r.vehicle}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-sm">
                      <Avatar initials={r.initials} className="h-7 w-7 text-xs" />
                      <span className="text-sm text-text-primary">{r.driver}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusPill tone="moderate">{r.match}</StatusPill>
                  </TableCell>
                  <TableCell>
                    <StatusPill tone={r.status.tone}>{r.status.label}</StatusPill>
                  </TableCell>
                  <TableCell className="!px-sm">
                    <button
                      type="button"
                      className="inline-flex items-center gap-xs rounded-md border border-border-secondary bg-bg-primary px-md py-xs text-xs font-semibold text-text-secondary shadow-xs hover:bg-bg-primary-hover"
                    >
                      ▶ Play
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
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
