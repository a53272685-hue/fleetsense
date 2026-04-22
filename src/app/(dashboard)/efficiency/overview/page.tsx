"use client";

import { useState } from "react";
import {
  MetricsCard,
  AlertBanner,
  PageHeader,
  FilterChip,
  CardPanel,
  ChartLegend,
  MiniMetric,
  TableSectionHeader,
  Pagination,
} from "@/components/ui";
import {
  UtilizationColumnChart,
  type ColumnDatum,
} from "@/components/charts";
import {
  DriversPerformanceTable,
  type DriverRow,
} from "@/components/tables";
import {
  KpiSmTimeIcon,
  KpiSmOverIcon,
  KpiSmUtilizationIcon,
  KpiSmTripIcon,
  KpiSmTruckIcon,
  ChevronDownIcon,
  CalendarIcon,
  FilterLinesIcon,
} from "@/components/icons";

// ---------- Mock data ----------

// Efficiency Distribution by Score — 11 buckets, 3 categories (Needs Coaching
// red / On Track green / Top Performer blue). The UtilizationColumnChart
// supports "under" (red) / "optimal" (green) / "over" (orange) / "inactive"
// (gray) by category key — we map Needs Coaching→under, On Track→optimal,
// Top Performer→over (reusing the color system; see chart legend labels).
// 11 buckets per Figma (0-9 ... 91-100).
// Needs Coaching → under (red), On Track → optimal (green), Top Performer → over (orange).
const distributionData: ColumnDatum[] = [
  { bucket: "0-9", value: 90, category: "under" },
  { bucket: "10-19", value: 110, category: "under" },
  { bucket: "20-29", value: 105, category: "under" },
  { bucket: "30-39", value: 95, category: "under" },
  { bucket: "40-49", value: 100, category: "under" },
  { bucket: "50-59", value: 95, category: "under" },
  { bucket: "60-69", value: 90, category: "optimal" },
  { bucket: "70-79", value: 95, category: "optimal" },
  { bucket: "80-89", value: 115, category: "over" },
  { bucket: "90-99", value: 120, category: "over" },
  { bucket: "91-100", value: 128, category: "over" },
];

const driverRows: DriverRow[] = [
  { id: "1", initials: "MT", name: "Marcus Thompson", location: "Calgary AB", scorePct: 86, status: { label: "Optimal", tone: "optimal" }, miles: 1560, idleScorePct: "8.2%", speedScorePct: "2.1%", rpmScore: "1.42", cruiseScorePct: "68%" },
  { id: "2", initials: "PS", name: "Priya Sandhu", location: "Edmonton AB", scorePct: 92, status: { label: "Optimal", tone: "optimal" }, miles: 2105, idleScorePct: "4.1%", speedScorePct: "1.3%", rpmScore: "1.65", cruiseScorePct: "88%" },
  { id: "3", initials: "DO", name: "Derek Okafor", location: "Winnipeg MB", scorePct: 67, status: { label: "Moderate", tone: "moderate" }, miles: 945, idleScorePct: "15.7%", speedScorePct: "6.8%", rpmScore: "1.08", cruiseScorePct: "52%" },
  { id: "4", initials: "LH", name: "Luis Hernandez", location: "Regina SK", scorePct: 78, status: { label: "Optimal", tone: "optimal" }, miles: 1312, idleScorePct: "9.5%", speedScorePct: "3.2%", rpmScore: "1.21", cruiseScorePct: "72%" },
  { id: "5", initials: "AP", name: "Anika Patel", location: "Lethbridge AB", scorePct: 54, status: { label: "Low", tone: "low" }, miles: 623, idleScorePct: "22.3%", speedScorePct: "8.9%", rpmScore: "0.92", cruiseScorePct: "41%" },
  { id: "6", initials: "SC", name: "Sarah Chen", location: "Saskatoon SK", scorePct: 81, status: { label: "Optimal", tone: "optimal" }, miles: 1478, idleScorePct: "7.6%", speedScorePct: "2.5%", rpmScore: "1.51", cruiseScorePct: "76%" },
  { id: "7", initials: "JW", name: "James Whitfield", location: "Red Deer AB", scorePct: 73, status: { label: "Moderate", tone: "moderate" }, miles: 1089, idleScorePct: "11.8%", speedScorePct: "4.7%", rpmScore: "1.22", cruiseScorePct: "61%" },
  { id: "8", initials: "NK", name: "Nadia Kowalski", location: "Brandon MB", scorePct: 41, status: { label: "Low", tone: "low" }, miles: 387, idleScorePct: "28.4%", speedScorePct: "11.2%", rpmScore: "0.78", cruiseScorePct: "34%" },
  { id: "9", initials: "CR", name: "Carlos Rivera", location: "Moose Jaw SK", scorePct: 88, status: { label: "Optimal", tone: "optimal" }, miles: 1734, idleScorePct: "5.9%", speedScorePct: "1.8%", rpmScore: "1.58", cruiseScorePct: "82%" },
  { id: "10", initials: "EJ", name: "Emma Johnson", location: "Medicine Hat AB", scorePct: 76, status: { label: "Moderate", tone: "moderate" }, miles: 1201, idleScorePct: "10.3%", speedScorePct: "3.9%", rpmScore: "1.30", cruiseScorePct: "66%" },
];

const distributionLegend = [
  { label: "Needs Coaching", color: "var(--utility-error-500)" },
  { label: "On Track", color: "var(--utility-success-500)" },
  { label: "Top Performer", color: "var(--utility-warning-500)" },
];

// ---------- Page ----------

export default function EfficiencyOverviewPage() {
  const enter = "fs-animate-enter";
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4xl">
      {/* Page header */}
      <div className={enter} style={{ animationDelay: "0ms" }}>
        <PageHeader
          title="Efficiency Overview"
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

      {/* Alert banner */}
      <div className={enter} style={{ animationDelay: "60ms" }}>
        <AlertBanner actionLabel="View Drivers">
          3 drivers exceeded idle threshold this week — estimated $1,240 in
          avoidable fuel cost
        </AlertBanner>
      </div>

      {/* 5 KPI cards with loss $ meta */}
      <section
        className={`${enter} grid grid-cols-5 gap-md`}
        style={{ animationDelay: "120ms" }}
      >
        <MetricsCard
          icon={KpiSmTimeIcon}
          iconTone="brand"
          title="Avoidable Idle"
          value="1.1h"
          trend={{ direction: "up", value: "8.3%" }}
          meta={[
            { label: "Target", value: "0.5h" },
            { label: "Est. Loss", value: "$2,340/wk", tone: "error" },
          ]}
        />
        <MetricsCard
          icon={KpiSmOverIcon}
          iconTone="brand"
          title="Over Speed"
          value="247"
          trend={{ direction: "up", value: "12.1%" }}
          meta={[
            { label: "Target", value: "< 200" },
            { label: "Risk Cost", value: "$890/wk", tone: "error" },
          ]}
        />
        <MetricsCard
          icon={KpiSmUtilizationIcon}
          iconTone="brand"
          title="High RPM"
          value="183"
          trend={{ direction: "up", value: "5.6%" }}
          meta={[
            { label: "Target", value: "< 150" },
            { label: "Maint. Cost", value: "$560/wk", tone: "error" },
          ]}
        />
        <MetricsCard
          icon={KpiSmTripIcon}
          iconTone="brand"
          title="Cruise Duration"
          value="2h"
          trend={{ direction: "up", value: "3.8%" }}
          meta={[
            { label: "Target", value: "> 3h" },
            { label: "Saving", value: "$1,120/wk", tone: "error" },
          ]}
        />
        <MetricsCard
          icon={KpiSmTruckIcon}
          iconTone="brand"
          title="Idle Fuel Waste"
          value="312L"
          trend={{ direction: "up", value: "6.2%" }}
          meta={[
            { label: "Target", value: "< 200L" },
            { label: "Fuel Loss", value: "$1,870/wk", tone: "error" },
          ]}
        />
      </section>

      {/* Efficiency Distribution Status */}
      <section
        className={`${enter} flex flex-col gap-lg`}
        style={{ animationDelay: "180ms" }}
      >
        <h2 className="text-2xl font-semibold text-text-primary">
          Efficiency Distribution Status
        </h2>
        <div className="flex gap-lg">
          <CardPanel title="Efficiency Distribution by Score" className="flex-1">
            <div className="flex flex-col gap-xs">
              <div className="px-2xl py-md">
                <ChartLegend items={distributionLegend} />
              </div>
              <div className="flex flex-col items-center gap-xs p-2xl">
                <UtilizationColumnChart data={distributionData} average={80} />
                <p className="text-sm text-text-tertiary">%</p>
              </div>
            </div>
          </CardPanel>

          <div className="flex w-[370px] flex-col justify-between">
            <MiniMetric label="Avg Score" value="89%" suffix="+4.5%" />
            <MiniMetric label="Needs Coaching" value="160" suffix="vs last week" />
            <MiniMetric label="On Track" value="120" suffix="vs last week" />
            <MiniMetric label="Top Performer" value="63" suffix="vs last week" />
          </div>
        </div>
      </section>

      {/* Drivers Performance table */}
      <section
        className={`${enter} overflow-hidden rounded-xl border border-border-secondary bg-bg-primary`}
        style={{ animationDelay: "240ms" }}
      >
        <TableSectionHeader title="Drivers Performance" />
        <DriversPerformanceTable rows={driverRows} />
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
