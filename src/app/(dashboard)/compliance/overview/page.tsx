"use client";

import {
  PageHeader,
  FilterChip,
  CardPanel,
  ComplianceStatusCard,
  PriorityActionsPanel,
  TableSectionHeader,
  Avatar,
  StatusPill,
  TabBar,
  ChartLegend,
  type PriorityAction,
} from "@/components/ui";
import {
  ComplianceTrendChart,
  type ComplianceTrendDatum,
} from "@/components/charts";
import {
  TableHeader,
  TableCell,
  TableRow,
} from "@/components/tables";
import {
  KpiSmErrorIcon,
  KpiSmFileBlankIcon,
  KpiSmTruckIcon,
  ChevronDownIcon,
  CalendarIcon,
  FilterLinesIcon,
} from "@/components/icons";
import { useState } from "react";

// ---------- Mock data ----------

const TREND_TABS = ["All", "HOS Violations", "Hours of Service"] as const;
type TrendTab = (typeof TREND_TABS)[number];

// 14-day compliance trend — HOS Violations (blue bars) + Defects (purple
// bars) + Unassigned x10 (gray line overlay).
const trendData: ComplianceTrendDatum[] = Array.from({ length: 14 }, (_, i) => ({
  label: `Jan ${i + 1}`,
  hos: 3 + (i % 4) * 2 + (i > 10 ? 2 : 0),
  defects: 2 + (i % 3) * 2 + (i > 9 ? 1 : 0),
  unassigned: 2 + i * 0.4 + (i % 2) * 0.5,
}));

type AtRiskRow = {
  id: string;
  initials: string;
  name: string;
  type: "Driver" | "Asset";
  risk: "High" | "Medium" | "Low";
  issues: { label: string; tone: "risk-high" | "risk-medium" | "risk-low" | "moderate" }[];
};

const atRiskRows: AtRiskRow[] = [
  {
    id: "1",
    initials: "JM",
    name: "John Martinez",
    type: "Driver",
    risk: "High",
    issues: [
      { label: "2 HOS Violations", tone: "risk-high" },
      { label: "1 Critical Defect", tone: "risk-high" },
    ],
  },
  {
    id: "2",
    initials: "NK",
    name: "Nadia Kowalski",
    type: "Driver",
    risk: "High",
    issues: [
      { label: "5 HOS Violations", tone: "risk-high" },
      { label: "3 Missed DVIRs", tone: "risk-high" },
    ],
  },
  {
    id: "3",
    initials: "LH",
    name: "Luis Hernandez",
    type: "Driver",
    risk: "Medium",
    issues: [
      { label: "1 CSA Warning", tone: "risk-medium" },
      { label: "2 Unverified Logs", tone: "risk-medium" },
    ],
  },
  {
    id: "4",
    initials: "DO",
    name: "Derek Okafor",
    type: "Asset",
    risk: "Medium",
    issues: [
      { label: "4 Missed Inspections", tone: "risk-medium" },
      { label: "1 OOS Order", tone: "risk-medium" },
    ],
  },
];

const priorityActions: PriorityAction[] = [
  {
    id: "1",
    icon: KpiSmErrorIcon,
    tone: "error",
    title: "380 Blank Logs",
    subtitle: "Resolve Unassigned Driving",
    href: "/compliance/hos",
  },
  {
    id: "2",
    icon: KpiSmErrorIcon,
    tone: "warning",
    title: "12 Expiring Licenses",
    subtitle: "Renew Driver Certifications",
    href: "/compliance/hos",
  },
  {
    id: "3",
    icon: KpiSmErrorIcon,
    tone: "error",
    title: "5 Overdue DVIRs",
    subtitle: "Complete Vehicle Inspections",
    href: "/compliance/maintenance",
  },
];

// ---------- Page ----------

export default function ComplianceOverviewPage() {
  const enter = "fs-animate-enter";
  const [tab, setTab] = useState<TrendTab>("All");

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4xl">
      {/* Page header */}
      <div className={enter} style={{ animationDelay: "0ms" }}>
        <PageHeader
          title="Compliance Overview"
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

      {/* 3 big status cards */}
      <section
        className={`${enter} grid grid-cols-3 gap-lg`}
        style={{ animationDelay: "60ms" }}
      >
        <ComplianceStatusCard
          icon={KpiSmErrorIcon}
          iconTone="error"
          title="HOS Compliance"
          primaryLabel="Blank Logs"
          primaryValue="380"
          viewHref="/compliance/hos"
          rows={[
            { label: "Violations", barPct: 60, value: "14 days" },
            { label: "Unverified Log", barPct: 55, value: "2 days" },
          ]}
        />
        <ComplianceStatusCard
          icon={KpiSmFileBlankIcon}
          iconTone="gray"
          title="CSA & Safety"
          primaryLabel="OOS Rate"
          primaryValue="14%"
          viewHref="/compliance/csa"
          rows={[{ label: "Clean Inspection Rate", barPct: 82, value: "82%" }]}
        />
        <ComplianceStatusCard
          icon={KpiSmTruckIcon}
          iconTone="gray"
          title="Fleet Health"
          primaryLabel="Active Defects"
          primaryValue="22"
          viewHref="/compliance/maintenance"
          rows={[{ label: "Overdue Services", value: "3" }]}
        />
      </section>

      {/* Compliance Trend grouped column chart */}
      <section className={enter} style={{ animationDelay: "120ms" }}>
        <CardPanel title="Compliance Trend">
          <div className="flex flex-col gap-xs">
            <div className="flex items-center justify-between gap-md px-2xl">
              <TabBar options={TREND_TABS} value={tab} onChange={setTab} />
              <ChartLegend
                items={[
                  { label: "HOS Violations", color: "var(--utility-brand-500)" },
                  { label: "Defects", color: "var(--utility-purple-500)" },
                  { label: "Unassigned (x10)", color: "var(--utility-gray-500)" },
                ]}
              />
            </div>
            <div className="p-2xl">
              <ComplianceTrendChart
                data={trendData}
                yDomain={[0, 10]}
                yTicks={[0, 2, 4, 6, 8, 10]}
              />
            </div>
          </div>
        </CardPanel>
      </section>

      {/* At-Risk table + Priority Actions panel */}
      <section
        className={`${enter} grid grid-cols-[1fr_380px] gap-lg`}
        style={{ animationDelay: "180ms" }}
      >
        <div className="flex flex-col overflow-hidden rounded-xl border border-border-secondary bg-bg-primary">
          <TableSectionHeader
            title="At-Risk Drivers & Assets"
            searchPlaceholder={null}
          />
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr>
                <TableHeader className="w-[200px]">Entity Name</TableHeader>
                <TableHeader className="w-[88px]">Type</TableHeader>
                <TableHeader className="w-[104px]">Risk Level</TableHeader>
                <TableHeader>Identified Issues</TableHeader>
                <TableHeader className="w-[120px] !px-sm">
                  <span className="sr-only">Action</span>
                </TableHeader>
              </tr>
            </thead>
            <tbody>
              {atRiskRows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="flex items-center gap-md">
                      <Avatar initials={r.initials} />
                      <span className="text-sm font-medium text-text-primary">
                        {r.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusPill tone="moderate">{r.type}</StatusPill>
                  </TableCell>
                  <TableCell>
                    <StatusPill
                      tone={
                        r.risk === "High"
                          ? "risk-high"
                          : r.risk === "Medium"
                            ? "risk-medium"
                            : "risk-low"
                      }
                    >
                      {r.risk}
                    </StatusPill>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-xs">
                      {r.issues.map((iss) => (
                        <StatusPill key={iss.label} tone={iss.tone}>
                          {iss.label}
                        </StatusPill>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="!px-sm">
                    <button
                      type="button"
                      className="rounded-md border border-border-secondary bg-bg-primary px-md py-xs text-xs font-semibold text-text-secondary shadow-xs transition-colors duration-[var(--duration-fast)] hover:bg-bg-primary-hover"
                    >
                      Investigate
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>

        <PriorityActionsPanel
          count={7}
          actions={priorityActions}
          viewAllHref="/compliance/hos"
        />
      </section>
    </div>
  );
}
