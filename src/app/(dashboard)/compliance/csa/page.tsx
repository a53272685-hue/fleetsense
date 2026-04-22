"use client";

import { useState } from "react";
import {
  PageHeader,
  FilterChip,
  CardPanel,
  MetricsCard,
  TabBar,
  StatusPill,
  TableSectionHeader,
  Avatar,
  Pagination,
} from "@/components/ui";
import {
  GroupedColumnChart,
  HorizontalBarChart,
  USHotspotMap,
  type GroupedColumnDatum,
  type HorizontalBarDatum,
  type Hotspot,
} from "@/components/charts";
import {
  TableHeader,
  TableCell,
  TableRow,
} from "@/components/tables";
import {
  KpiSmFileBlankIcon,
  KpiSmCleanIcon,
  KpiSmErrorIcon,
  KpiSmTruckIcon,
  ChevronDownIcon,
  CalendarIcon,
  FilterLinesIcon,
  SearchLgIcon,
} from "@/components/icons";

// ---------- Mock data ----------

const HOTSPOT_TABS = ["Inspections", "Violations", "OOS", "Crashes"] as const;
type HotspotTab = (typeof HOTSPOT_TABS)[number];

const RECORD_TABS = [
  { label: "Inspection", count: 6 },
  { label: "Crashes", count: 2 },
  { label: "Vehicle", count: 6 },
  { label: "Drivers", count: 6 },
] as const;

const hotspotReports = [
  { date: "Jan 2, 2026", reportId: "APZ7540963" },
  { date: "Jan 3, 2026", reportId: "FL33091047" },
  { date: "Jan 4, 2026", reportId: "TX953206714" },
  { date: "Jan 5, 2026", reportId: "NY41832356" },
];

// Hotspot coordinates are approximate — x/y are percentages of the SVG
// viewBox and were eyeballed to roughly match US state positions in
// USHotspotMap's simplified outline.
const hotspots: Hotspot[] = [
  { id: "mia", label: "Miami, FL", x: 78, y: 82, badge: "15 violation", tone: "risk-high" },
  { id: "den", label: "Denver, CO", x: 44, y: 48, badge: "8 violation", tone: "risk-medium" },
  { id: "atl", label: "Atlanta, GA", x: 72, y: 62, badge: "4 violation", tone: "risk-low" },
  { id: "lax", label: "Los Angeles, CA", x: 18, y: 54, badge: "11 violation", tone: "risk-medium" },
];

// Side-by-side 2-series bar chart data (Inspection Results / Violation Analysis)
const distData: GroupedColumnDatum[] = [
  { label: "0-50", blue: 35, purple: 25 },
  { label: "51-60", blue: 45, purple: 30 },
  { label: "61-70", blue: 50, purple: 40 },
  { label: "71-80", blue: 55, purple: 45 },
  { label: "81-90", blue: 60, purple: 55 },
];

const severityData: HorizontalBarDatum[] = [
  { label: "Unsafe Driving", pct: 71.2, valueText: "71.2%", trailing: "5" },
  { label: "Vehicle Maint.", pct: 58.3, valueText: "58.3%", trailing: "4" },
  { label: "HOS Compliance", pct: 82.1, valueText: "82.1%", trailing: "2" },
  { label: "Driver Fitness", pct: 45.8, valueText: "45.8%", trailing: "1" },
  { label: "Drugs/Alcohol", pct: 91.0, valueText: "91.0%", trailing: "1" },
  { label: "Hazmat", pct: 67.8, valueText: "67.8%", trailing: "2" },
];

type RecordRow = {
  date: string;
  reportId: string;
  type: { label: string; tone: "crash" | "hos" | "vehicle" | "driver" | "hazmat" };
  level: "Level 1" | "Level 2" | "Level 3";
  state: string;
  violations: number;
  oos: number;
  vehicle: string;
  driverInitials: string;
  driver: string;
};

const recordRows: RecordRow[] = [
  { date: "Jan 1, 2026, 8:30 am", reportId: "MD-9921", type: { label: "Crash", tone: "crash" }, level: "Level 1", state: "MD", violations: 0, oos: 0, vehicle: "Truck 47-A", driverInitials: "JM", driver: "John Martinez" },
  { date: "Jan 2, 2026, 10:15 am", reportId: "VA-4582", type: { label: "HOS", tone: "hos" }, level: "Level 3", state: "VA", violations: 2, oos: 1, vehicle: "Fleet-087", driverInitials: "PS", driver: "Priya Sandhu" },
  { date: "Jan 4, 2026, 8:45 am", reportId: "OH-7734", type: { label: "Vehicle", tone: "vehicle" }, level: "Level 1", state: "OH", violations: 1, oos: 0, vehicle: "Fleet-204", driverInitials: "DO", driver: "Derek Okafor" },
  { date: "Jan 5, 2026, 11:20 am", reportId: "TX-2201", type: { label: "Driver", tone: "driver" }, level: "Level 2", state: "TX", violations: 1, oos: 0, vehicle: "Fleet-155", driverInitials: "LH", driver: "Luis Hernandez" },
  { date: "Jan 6, 2026, 4:00 pm", reportId: "PA-6689", type: { label: "HOS", tone: "hos" }, level: "Level 3", state: "PA", violations: 3, oos: 2, vehicle: "Fleet-312", driverInitials: "AP", driver: "Anika Patel" },
  { date: "Jan 7, 2026, 9:30 am", reportId: "IL-1147", type: { label: "Hazmat", tone: "hazmat" }, level: "Level 1", state: "IL", violations: 1, oos: 1, vehicle: "Fleet-443", driverInitials: "SC", driver: "Sarah Chen" },
  { date: "Jan 8, 2026, 1:45 pm", reportId: "GA-8823", type: { label: "Vehicle", tone: "vehicle" }, level: "Level 2", state: "GA", violations: 2, oos: 0, vehicle: "Fleet-067", driverInitials: "JW", driver: "James Whitfield" },
  { date: "Jan 9, 2026, 3:00 pm", reportId: "NY-3356", type: { label: "Crash", tone: "crash" }, level: "Level 1", state: "NY", violations: 2, oos: 0, vehicle: "Fleet-289", driverInitials: "NK", driver: "Nadia Kowalski" },
  { date: "Jan 10, 2026, 10:15 am", reportId: "CA-5501", type: { label: "Driver", tone: "driver" }, level: "Level 3", state: "CA", violations: 1, oos: 0, vehicle: "Fleet-518", driverInitials: "CR", driver: "Carlos Rivera" },
  { date: "Jan 11, 2026, 7:30 am", reportId: "FL-9912", type: { label: "HOS", tone: "hos" }, level: "Level 2", state: "FL", violations: 0, oos: 0, vehicle: "Fleet-033", driverInitials: "EJ", driver: "Emma Johnson" },
];

// ---------- Page ----------

export default function ComplianceCSAPage() {
  const enter = "fs-animate-enter";
  const [hotspotTab, setHotspotTab] = useState<HotspotTab>("Inspections");
  const [recordTab, setRecordTab] = useState<string>("Inspection");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4xl">
      {/* Page header */}
      <div className={enter} style={{ animationDelay: "0ms" }}>
        <PageHeader
          title="Compliance CSA"
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

      {/* 4 KPI cards (simple, no meta) */}
      <section
        className={`${enter} grid grid-cols-4 gap-[13px]`}
        style={{ animationDelay: "60ms" }}
      >
        <MetricsCard
          icon={KpiSmFileBlankIcon}
          iconTone="gray"
          title="Inspections"
          value="124"
          trend={{ direction: "up", value: "4.7%" }}
        />
        <MetricsCard
          icon={KpiSmCleanIcon}
          iconTone="gray"
          title="Clean Rate"
          value="82%"
          trend={{ direction: "up", value: "2.3%" }}
        />
        <MetricsCard
          icon={KpiSmErrorIcon}
          iconTone="error"
          title="OOS Rate"
          value="14%"
          trend={{ direction: "up", value: "6.1%" }}
        />
        <MetricsCard
          icon={KpiSmTruckIcon}
          iconTone="gray"
          title="Total Crashes"
          value="2"
          trend={{ direction: "up", value: "3.5%" }}
        />
      </section>

      {/* Geographic Hotspots */}
      <section
        className={`${enter} flex flex-col gap-lg`}
        style={{ animationDelay: "120ms" }}
      >
        <h2 className="text-2xl font-semibold text-text-primary">
          Geographic Hotspots
        </h2>
        <div className="flex flex-col gap-lg">
          <TabBar
            options={HOTSPOT_TABS}
            value={hotspotTab}
            onChange={setHotspotTab}
          />
          <div className="grid grid-cols-[1fr_320px] gap-lg">
            {/* US Map with hotspot markers — click a marker to surface its
                label pill at the top-left corner. */}
            <USHotspotMap hotspots={hotspots} initialSelected="mia" />

            {/* Reports panel */}
            <CardPanel title="Inspection Reports">
              <div className="flex flex-col gap-md p-md">
                <div className="flex items-center justify-between border-b border-border-secondary px-lg pb-md">
                  <div className="flex flex-col">
                    <span className="text-xs text-text-tertiary">
                      Total Inspection
                    </span>
                    <span className="text-xl font-semibold text-text-primary">
                      45
                      <span className="ml-xs text-xs font-medium text-text-success-primary">
                        +4.3%
                      </span>
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-text-tertiary">
                      Violations
                    </span>
                    <span className="text-xl font-semibold text-text-primary">
                      9
                    </span>
                  </div>
                </div>
                <ul className="flex flex-col divide-y divide-border-secondary">
                  {hotspotReports.map((r) => (
                    <li
                      key={r.reportId}
                      className="flex items-center justify-between px-lg py-md"
                    >
                      <span className="text-sm text-text-tertiary">
                        {r.date}
                      </span>
                      <span className="text-sm font-medium text-text-error-primary">
                        {r.reportId}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardPanel>
          </div>
        </div>
      </section>

      {/* 3 analysis charts */}
      <section
        className={`${enter} grid grid-cols-3 gap-lg`}
        style={{ animationDelay: "180ms" }}
      >
        <CardPanel title="Inspection Results">
          <div className="p-2xl">
            <GroupedColumnChart
              data={distData}
              series={[
                { key: "blue", name: "Pass", color: "var(--utility-brand-500)" },
                { key: "purple", name: "Fail", color: "var(--utility-purple-500)" },
              ]}
              yDomain={[0, 70]}
              yTicks={[0, 20, 40, 60]}
              height={180}
            />
          </div>
        </CardPanel>
        <CardPanel title="Violation Analysis">
          <div className="p-2xl">
            <GroupedColumnChart
              data={distData}
              series={[
                { key: "blue", name: "A", color: "var(--utility-brand-500)" },
                { key: "purple", name: "B", color: "var(--utility-purple-500)" },
              ]}
              yDomain={[0, 70]}
              yTicks={[0, 20, 40, 60]}
              height={180}
            />
          </div>
        </CardPanel>
        <CardPanel title="Violation Severity Weight">
          <div className="p-2xl">
            <HorizontalBarChart data={severityData} />
          </div>
        </CardPanel>
      </section>

      {/* Detailed Records */}
      <section
        className={`${enter} overflow-hidden rounded-xl border border-border-secondary bg-bg-primary`}
        style={{ animationDelay: "240ms" }}
      >
        <TableSectionHeader title="Detailed Records" searchPlaceholder="Search" />
        <div className="flex items-center justify-between gap-lg px-3xl pb-lg">
          <div className="flex items-center gap-md">
            <FilterChip rightIcon={ChevronDownIcon}>Type</FilterChip>
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
              className="w-[200px] bg-transparent text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none"
            />
          </div>
        </div>
        <div className="grid grid-cols-[160px_1fr]">
          {/* Left filter tabs */}
          <ul className="flex flex-col gap-xs border-r border-border-secondary p-md">
            {RECORD_TABS.map((t) => (
              <li key={t.label}>
                <button
                  type="button"
                  onClick={() => setRecordTab(t.label)}
                  aria-pressed={recordTab === t.label}
                  className={
                    "flex w-full items-center justify-between rounded-md px-md py-sm text-sm font-medium transition-colors duration-[var(--duration-fast)] " +
                    (recordTab === t.label
                      ? "bg-bg-primary-hover text-text-primary"
                      : "text-text-tertiary hover:bg-bg-primary-hover")
                  }
                >
                  <span>{t.label}</span>
                  <span className="text-xs text-text-quaternary">{t.count}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Main records table */}
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr>
                <TableHeader className="w-[120px] !px-lg">Report #</TableHeader>
                <TableHeader className="w-[88px] !px-sm">Type</TableHeader>
                <TableHeader className="w-[80px] !px-sm">Level</TableHeader>
                <TableHeader className="w-[56px] !px-sm">State</TableHeader>
                <TableHeader className="w-[80px] !px-sm">Violations</TableHeader>
                <TableHeader className="w-[56px] !px-sm">OOS</TableHeader>
                <TableHeader className="w-[96px] !px-sm">Vehicle</TableHeader>
                <TableHeader>Driver</TableHeader>
                <TableHeader className="w-[92px] !px-sm">
                  <span className="sr-only">Action</span>
                </TableHeader>
              </tr>
            </thead>
            <tbody>
              {recordRows.map((r) => (
                <TableRow key={r.reportId}>
                  <TableCell className="!px-lg font-medium text-text-error-primary">
                    {r.reportId}
                  </TableCell>
                  <TableCell className="!px-sm">
                    <StatusPill tone={r.type.tone}>{r.type.label}</StatusPill>
                  </TableCell>
                  <TableCell className="!px-sm">
                    <StatusPill
                      tone={
                        r.level === "Level 1"
                          ? "level-1"
                          : r.level === "Level 2"
                            ? "level-2"
                            : "level-3"
                      }
                    >
                      {r.level}
                    </StatusPill>
                  </TableCell>
                  <TableCell className="!px-sm text-text-tertiary">
                    {r.state}
                  </TableCell>
                  <TableCell className="!px-sm text-text-tertiary">
                    {r.violations}
                  </TableCell>
                  <TableCell className="!px-sm text-text-tertiary">
                    {r.oos}
                  </TableCell>
                  <TableCell className="!px-sm text-text-tertiary">
                    {r.vehicle}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-sm">
                      <Avatar initials={r.driverInitials} className="h-7 w-7 text-xs" />
                      <span className="text-sm text-text-primary">
                        {r.driver}
                      </span>
                    </div>
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
