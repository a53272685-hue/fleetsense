"use client";

import { useState } from "react";
import {
  PageHeader,
  FilterChip,
  MetricsCard,
  TabBar,
  StatusPill,
  Avatar,
  Pagination,
} from "@/components/ui";
import {
  TableHeader,
  TableCell,
  TableRow,
} from "@/components/tables";
import {
  KpiSmErrorIcon,
  KpiSmFileBlankIcon,
  KpiSmFileNeutralIcon,
  KpiSmEditIcon,
  ChevronDownIcon,
  CalendarIcon,
  FilterLinesIcon,
} from "@/components/icons";

// ---------- Mock data ----------

const LOG_TABS = ["Driver", "Asset", "Analysis", "YM Analysis"] as const;
type LogTab = (typeof LOG_TABS)[number];

type LogRow = {
  id: string;
  initials: string;
  name: string;
  driverId: string;
  group: string;
  lastUpdate: string;
  unverifiedLogs: number;
  requestedEdits: number;
  violations: number;
};

const logRows: LogRow[] = [
  { id: "1", initials: "SW", name: "Scott Weis", driverId: "ID - 257", group: "Scottsbluff NE", lastUpdate: "Jan 2, 2026, 10:30 am", unverifiedLogs: 2, requestedEdits: 2, violations: 2 },
  { id: "2", initials: "MR", name: "Mike Robinson", driverId: "ID - 312", group: "Denver CO", lastUpdate: "Jan 3, 2026, 2:15 pm", unverifiedLogs: 5, requestedEdits: 3, violations: 1 },
  { id: "3", initials: "TL", name: "Tony Lopez", driverId: "ID - 089", group: "Cheyenne WY", lastUpdate: "Jan 4, 2026, 8:45 am", unverifiedLogs: 1, requestedEdits: 0, violations: 0 },
  { id: "4", initials: "KJ", name: "Karen Johnson", driverId: "ID - 445", group: "Omaha NE", lastUpdate: "Jan 5, 2026, 11:20 am", unverifiedLogs: 3, requestedEdits: 1, violations: 3 },
  { id: "5", initials: "RB", name: "Robert Brown", driverId: "ID - 178", group: "Lincoln NE", lastUpdate: "Jan 6, 2026, 4:00 pm", unverifiedLogs: 0, requestedEdits: 4, violations: 1 },
];

// ---------- Page ----------

export default function ComplianceHOSPage() {
  const enter = "fs-animate-enter";
  const [tab, setTab] = useState<LogTab>("Driver");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4xl">
      {/* Page header */}
      <div className={enter} style={{ animationDelay: "0ms" }}>
        <PageHeader
          title="Compliance HOS"
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

      {/* 4 KPI cards (big value, no meta) */}
      <section
        className={`${enter} grid grid-cols-4 gap-[13px]`}
        style={{ animationDelay: "60ms" }}
      >
        <MetricsCard
          icon={KpiSmFileBlankIcon}
          iconTone="error"
          title="Blank Unassigned Logs"
          value="279"
          trend={{ direction: "up", value: "4.7%" }}
        />
        <MetricsCard
          icon={KpiSmFileNeutralIcon}
          iconTone="success"
          title="Unassigned Logs"
          value="12,831"
          trend={{ direction: "up", value: "2.3%" }}
        />
        <MetricsCard
          icon={KpiSmErrorIcon}
          iconTone="error"
          title="Unverified Logs"
          value="3,232"
          trend={{ direction: "up", value: "6.1%" }}
        />
        <MetricsCard
          icon={KpiSmEditIcon}
          iconTone="brand"
          title="Requested Edits"
          value="2"
          trend={{ direction: "up", value: "3.5%" }}
        />
      </section>

      {/* Log Details */}
      <section
        className={`${enter} overflow-hidden rounded-xl border border-border-secondary bg-bg-primary`}
        style={{ animationDelay: "120ms" }}
      >
        <header className="flex items-center gap-md px-3xl py-2xl">
          <h2 className="text-lg font-semibold text-text-primary">Log Details</h2>
          <StatusPill tone="risk-high">380 Pending</StatusPill>
        </header>
        <div className="flex items-center justify-between gap-lg px-3xl pb-lg">
          <div className="flex items-center gap-md">
            <TabBar options={LOG_TABS} value={tab} onChange={setTab} />
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
            <input
              type="search"
              placeholder="Search"
              className="w-[180px] bg-transparent text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none"
            />
          </div>
        </div>
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr>
              <TableHeader className="w-[200px]">Date</TableHeader>
              <TableHeader className="w-[180px]">Group</TableHeader>
              <TableHeader className="w-[220px]">Last Update</TableHeader>
              <TableHeader className="w-[140px] !px-lg">Unverified Logs</TableHeader>
              <TableHeader className="w-[140px] !px-lg">Requested Edits</TableHeader>
              <TableHeader className="w-[100px] !px-lg">Violations</TableHeader>
              <TableHeader className="w-[100px] !px-sm">
                <span className="sr-only">Action</span>
              </TableHeader>
            </tr>
          </thead>
          <tbody>
            {logRows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="flex items-center gap-md">
                    <Avatar initials={r.initials} />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-text-primary">
                        {r.name}
                      </span>
                      <span className="text-sm text-text-tertiary">
                        {r.driverId}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-text-tertiary">{r.group}</TableCell>
                <TableCell className="font-medium text-text-error-primary">
                  {r.lastUpdate}
                </TableCell>
                <TableCell className="!px-lg text-text-tertiary">
                  {r.unverifiedLogs}
                </TableCell>
                <TableCell className="!px-lg text-text-tertiary">
                  {r.requestedEdits}
                </TableCell>
                <TableCell className="!px-lg">
                  <StatusPill
                    tone={r.violations === 0 ? "moderate" : "risk-high"}
                  >
                    {r.violations}
                  </StatusPill>
                </TableCell>
                <TableCell className="!px-sm">
                  <button
                    type="button"
                    className="rounded-md border border-border-secondary bg-bg-primary px-md py-xs text-xs font-semibold text-text-secondary shadow-xs transition-colors duration-[var(--duration-fast)] hover:bg-bg-primary-hover"
                  >
                    Review
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
