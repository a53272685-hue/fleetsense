"use client";

import { useState } from "react";
import {
  PageHeader,
  FilterChip,
  CardPanel,
  MetricsCard,
  TabBar,
  StatusPill,
  Avatar,
  TableSectionHeader,
  ChartLegend,
  Pagination,
} from "@/components/ui";
import {
  GroupedColumnChart,
  DailyUtilizationStackedBar,
  type GroupedColumnDatum,
  type StackDatum,
} from "@/components/charts";
import {
  TableHeader,
  TableCell,
  TableRow,
} from "@/components/tables";
import {
  KpiSmFileCheckedIcon,
  KpiSmErrorIcon,
  KpiSmInspectionIcon,
  KpiSmTimeIcon,
  ChevronDownIcon,
  CalendarIcon,
  FilterLinesIcon,
} from "@/components/icons";

// ---------- Mock data ----------

const DVIR_TABS = ["Avg Duration", "Missed Inspections"] as const;
type DvirTab = (typeof DVIR_TABS)[number];

const DETAIL_TABS = ["Driver Performance", "Asset Health", "Defect Analysis"] as const;
type DetailTab = (typeof DETAIL_TABS)[number];

// 7-day pre/post DVIR duration grouped columns.
const dvirData: GroupedColumnDatum[] = [
  { label: "Jan 1", pre: 7, post: 4 },
  { label: "Jan 2", pre: 5, post: 3 },
  { label: "Jan 3", pre: 4, post: 3 },
  { label: "Jan 4", pre: 5, post: 3 },
  { label: "Jan 5", pre: 6, post: 4 },
  { label: "Jan 6", pre: 7, post: 5 },
  { label: "Jan 7", pre: 6, post: 4 },
];

// Reported Defects — 5-day stacked bar (Minor gray / Major orange / Critical red / On Track green).
// Reuses DailyUtilizationStackedBar by mapping: over=Minor, inactive=Major, under=Critical, optimal=OnTrack.
const defectsData: StackDatum[] = [
  { day: "Jan 1", optimal: 60, under: 5, inactive: 22, over: 13 },
  { day: "Jan 2", optimal: 70, under: 3, inactive: 20, over: 7 },
  { day: "Jan 3", optimal: 62, under: 5, inactive: 22, over: 11 },
  { day: "Jan 4", optimal: 68, under: 4, inactive: 20, over: 8 },
  { day: "Jan 5", optimal: 65, under: 4, inactive: 22, over: 9 },
];

type InspectionRow = {
  id: string;
  initials: string;
  name: string;
  preMissed: string;
  preCompletion: { label: string; tone: "optimal" | "risk-medium" | "risk-high" };
  preDurationAvg: string;
  postMissed: string;
  postCompletion: { label: string; tone: "optimal" | "risk-medium" | "risk-high" };
  postDurationAvg: string;
};

const inspectionRows: InspectionRow[] = [
  { id: "1", initials: "JM", name: "John Martinez", preMissed: "1/71", preCompletion: { label: "98%", tone: "optimal" }, preDurationAvg: "14m 10s", postMissed: "1/71", postCompletion: { label: "98%", tone: "optimal" }, postDurationAvg: "11m 20s" },
  { id: "2", initials: "PS", name: "Priya Sandhu", preMissed: "3/71", preCompletion: { label: "92%", tone: "optimal" }, preDurationAvg: "16m 45s", postMissed: "2/71", postCompletion: { label: "95%", tone: "optimal" }, postDurationAvg: "12m 30s" },
  { id: "3", initials: "DO", name: "Derek Okafor", preMissed: "0/71", preCompletion: { label: "100%", tone: "optimal" }, preDurationAvg: "12m 05s", postMissed: "0/71", postCompletion: { label: "100%", tone: "optimal" }, postDurationAvg: "10m 15s" },
  { id: "4", initials: "LH", name: "Luis Hernandez", preMissed: "5/71", preCompletion: { label: "85%", tone: "optimal" }, preDurationAvg: "18m 30s", postMissed: "4/71", postCompletion: { label: "88%", tone: "optimal" }, postDurationAvg: "15m 40s" },
  { id: "5", initials: "AP", name: "Anika Patel", preMissed: "2/71", preCompletion: { label: "96%", tone: "optimal" }, preDurationAvg: "13m 20s", postMissed: "1/71", postCompletion: { label: "97%", tone: "optimal" }, postDurationAvg: "11m 50s" },
  { id: "6", initials: "SC", name: "Sarah Chen", preMissed: "0/71", preCompletion: { label: "100%", tone: "optimal" }, preDurationAvg: "11m 45s", postMissed: "0/71", postCompletion: { label: "100%", tone: "optimal" }, postDurationAvg: "9m 30s" },
  { id: "7", initials: "JW", name: "James Whitfield", preMissed: "4/71", preCompletion: { label: "89%", tone: "optimal" }, preDurationAvg: "17m 15s", postMissed: "3/71", postCompletion: { label: "91%", tone: "optimal" }, postDurationAvg: "14m 20s" },
  { id: "8", initials: "NK", name: "Nadia Kowalski", preMissed: "7/71", preCompletion: { label: "78%", tone: "risk-medium" }, preDurationAvg: "22m 40s", postMissed: "6/71", postCompletion: { label: "82%", tone: "optimal" }, postDurationAvg: "19m 10s" },
  { id: "9", initials: "CR", name: "Carlos Rivera", preMissed: "1/71", preCompletion: { label: "99%", tone: "optimal" }, preDurationAvg: "12m 50s", postMissed: "0/71", postCompletion: { label: "100%", tone: "optimal" }, postDurationAvg: "10m 45s" },
  { id: "10", initials: "EJ", name: "Emma Johnson", preMissed: "2/71", preCompletion: { label: "95%", tone: "optimal" }, preDurationAvg: "15m 30s", postMissed: "2/71", postCompletion: { label: "95%", tone: "optimal" }, postDurationAvg: "13m 05s" },
];

// ---------- Page ----------

export default function ComplianceMaintenancePage() {
  const enter = "fs-animate-enter";
  const [dvirTab, setDvirTab] = useState<DvirTab>("Avg Duration");
  const [detailTab, setDetailTab] = useState<DetailTab>("Driver Performance");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4xl">
      {/* Page header */}
      <div className={enter} style={{ animationDelay: "0ms" }}>
        <PageHeader
          title="Compliance Maintenance"
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

      {/* 4 KPI cards */}
      <section
        className={`${enter} grid grid-cols-4 gap-[13px]`}
        style={{ animationDelay: "60ms" }}
      >
        <MetricsCard
          icon={KpiSmFileCheckedIcon}
          iconTone="success"
          title="Defect Discovery"
          value="35 days"
          trend={{ direction: "up", value: "5.4%" }}
          meta={[
            { label: "Target", value: "80%" },
            { label: "Avg", value: "74%" },
          ]}
        />
        <MetricsCard
          icon={KpiSmErrorIcon}
          iconTone="error"
          title="Active Defects"
          value="27"
          trend={{ direction: "up", value: "3.8%" }}
          meta={[{ label: "Total", value: "2,389" }]}
        />
        <MetricsCard
          icon={KpiSmInspectionIcon}
          iconTone="brand"
          title="Missed DVIRs"
          value="91 days"
          trend={{ direction: "up", value: "7.2%" }}
          meta={[
            { label: "Target", value: "12 days" },
            { label: "Avg", value: "14 days" },
          ]}
        />
        <MetricsCard
          icon={KpiSmTimeIcon}
          iconTone="brand"
          title="Avg Duration"
          value="21:24m"
          trend={{ direction: "down", value: "2.1%" }}
          meta={[
            { label: "Target", value: "20m" },
            { label: "Avg", value: "22:23m" },
          ]}
        />
      </section>

      {/* DVIR Quality Trend + Reported Defects */}
      <section
        className={`${enter} grid grid-cols-2 gap-lg`}
        style={{ animationDelay: "120ms" }}
      >
        <CardPanel title="DVIR Quality Trend">
          <div className="flex flex-col gap-xs">
            <div className="flex items-center justify-between gap-md px-2xl">
              <TabBar options={DVIR_TABS} value={dvirTab} onChange={setDvirTab} />
              <ChartLegend
                items={[
                  { label: "Pre Duration", color: "var(--utility-brand-500)" },
                  { label: "Post Duration", color: "var(--utility-purple-500)" },
                ]}
              />
            </div>
            <div className="p-2xl">
              <GroupedColumnChart
                data={dvirData}
                series={[
                  { key: "pre", name: "Pre Duration", color: "var(--utility-brand-500)" },
                  { key: "post", name: "Post Duration", color: "var(--utility-purple-500)" },
                ]}
                yDomain={[0, 10]}
                yTicks={[0, 2, 4, 6, 8, 10]}
              />
            </div>
          </div>
        </CardPanel>

        <CardPanel
          title="Reported Defects"
          headerExtra={
            <ChartLegend
              items={[
                { label: "Critical", color: "var(--utility-error-500)" },
                { label: "Major", color: "var(--utility-warning-500)" },
                { label: "Minor", color: "var(--utility-gray-300)" },
              ]}
            />
          }
        >
          <div className="p-2xl">
            <DailyUtilizationStackedBar data={defectsData} />
          </div>
        </CardPanel>
      </section>

      {/* Inspection & Defect Detail table */}
      <section
        className={`${enter} overflow-hidden rounded-xl border border-border-secondary bg-bg-primary`}
        style={{ animationDelay: "180ms" }}
      >
        <TableSectionHeader
          title="Inspection & Defect Detail"
          searchPlaceholder="Search"
        />
        <div className="flex items-center justify-between gap-lg px-3xl pb-lg">
          <TabBar
            options={DETAIL_TABS}
            value={detailTab}
            onChange={setDetailTab}
          />
          <div className="flex items-center gap-md">
            <div className="flex">
              <FilterChip segment="left" rightIcon={ChevronDownIcon}>
                Last 7 days
              </FilterChip>
              <FilterChip segment="right" leftIcon={CalendarIcon}>
                Jan 1 – Jan 7
              </FilterChip>
            </div>
          </div>
        </div>
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr>
              <TableHeader className="w-[200px]">Driver Name</TableHeader>
              <TableHeader className="!px-lg">Pre Missed</TableHeader>
              <TableHeader className="!px-lg">Pre Completion %</TableHeader>
              <TableHeader className="!px-lg">Pre Duration Avg</TableHeader>
              <TableHeader className="!px-lg">Post Missed</TableHeader>
              <TableHeader className="!px-lg">Post Completion %</TableHeader>
              <TableHeader className="!px-lg">Post Duration Avg</TableHeader>
              <TableHeader className="w-[88px] !px-sm">
                <span className="sr-only">Action</span>
              </TableHeader>
            </tr>
          </thead>
          <tbody>
            {inspectionRows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="flex items-center gap-md">
                    <Avatar initials={r.initials} />
                    <span className="text-sm font-medium text-text-primary">
                      {r.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="!px-lg text-text-tertiary">
                  {r.preMissed}
                </TableCell>
                <TableCell className="!px-lg">
                  <StatusPill tone={r.preCompletion.tone}>
                    {r.preCompletion.label}
                  </StatusPill>
                </TableCell>
                <TableCell className="!px-lg text-text-tertiary">
                  {r.preDurationAvg}
                </TableCell>
                <TableCell className="!px-lg text-text-tertiary">
                  {r.postMissed}
                </TableCell>
                <TableCell className="!px-lg">
                  <StatusPill tone={r.postCompletion.tone}>
                    {r.postCompletion.label}
                  </StatusPill>
                </TableCell>
                <TableCell className="!px-lg text-text-tertiary">
                  {r.postDurationAvg}
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
