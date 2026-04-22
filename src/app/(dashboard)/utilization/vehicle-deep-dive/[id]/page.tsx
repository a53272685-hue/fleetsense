"use client";

import {
  PageHeader,
  FilterChip,
  CardPanel,
  VehicleInfoCard,
  ProgressKpiCard,
  MiniMetric,
  TabBar,
  ChartLegend,
  ZoneActivityList,
  TableSectionHeader,
  type VehicleInlineKpi,
  type ZoneActivityRow,
} from "@/components/ui";
import {
  UtilizationColumnChart,
  FleetCompositionDonut,
  DualAreaLineChart,
  type ColumnDatum,
  type CompositionDatum,
  type DualSeriesDatum,
} from "@/components/charts";
import {
  TableHeader,
  TableCell,
  TableRow,
} from "@/components/tables";
import {
  KpiSmUtilizationIcon,
  KpiSmTimeIcon,
  ChevronDownIcon,
  CalendarIcon,
  FilterLinesIcon,
} from "@/components/icons";
import { useState } from "react";

type Props = { params: { id: string } };

// ---------- Mock data ----------

const vehicleKpis: VehicleInlineKpi[] = [
  { label: "Total Miles", value: "9,023", trend: { direction: "up", value: "4.8%" } },
  { label: "Trips", value: "725", trend: { direction: "up", value: "7.2%" } },
  { label: "Engine Hours", value: "245 h", trend: { direction: "up", value: "3.5%" } },
  { label: "Fuel Used", value: "238 gal", trend: { direction: "up", value: "5.1%" } },
];

const TAB_OPTIONS = ["Utilization", "Distribution", "Trips"] as const;
type TabOption = (typeof TAB_OPTIONS)[number];

// 14-day column chart data (matches Figma: mostly "optimal" with a mix)
const daily14: ColumnDatum[] = [
  { bucket: "Jan 1", value: 65, category: "optimal" },
  { bucket: "Jan 2", value: 72, category: "optimal" },
  { bucket: "Jan 3", value: 78, category: "optimal" },
  { bucket: "Jan 4", value: 62, category: "optimal" },
  { bucket: "Jan 5", value: 70, category: "optimal" },
  { bucket: "Jan 6", value: 75, category: "optimal" },
  { bucket: "Jan 7", value: 68, category: "optimal" },
  { bucket: "Jan 8", value: 63, category: "optimal" },
  { bucket: "Jan 9", value: 60, category: "optimal" },
  { bucket: "Jan 10", value: 68, category: "optimal" },
  { bucket: "Jan 11", value: 72, category: "optimal" },
  { bucket: "Jan 12", value: 75, category: "optimal" },
  { bucket: "Jan 13", value: 72, category: "optimal" },
  { bucket: "Jan 14", value: 78, category: "optimal" },
];

// Time Breakdown donut (Driving 73% / Idling 14% / Stopped 9% / PTO 4%)
const timeBreakdown: CompositionDatum[] = [
  { label: "Optimal", value: 178 },      // "Driving" — reusing existing labels
  { label: "Under-Utilized", value: 34 },// "Idling"
  { label: "Over-Utilized", value: 23 }, // "Stopped"
  { label: "Inactive", value: 10 },      // "PTO"
];

// Performance Trends dual area (Utilization vs Efficiency MPG)
const perfTrends: DualSeriesDatum[] = Array.from({ length: 14 }, (_, i) => ({
  label: `Jan ${i + 1}`,
  utilization: 40 + i * 4 + (i % 3) * 3,
  efficiency: 30 + i * 3 + (i % 2) * 5,
}));

const zoneRows: ZoneActivityRow[] = [
  { label: "Customer Sites", pct: 42.1 },
  { label: "Distribution Centers", pct: 28.7 },
  { label: "Maintenance Facilities", pct: 17.3 },
  { label: "Job Sites", pct: 11.9 },
];

type ZoneMetricRow = {
  zone: string;
  visits: string;
  duration: string;
  avgStay: string;
  avgIdle: string;
};

const zoneMetrics: ZoneMetricRow[] = [
  { zone: "Customer Sites", visits: "172 / 230", duration: "285 / 620h", avgStay: "3.8h", avgIdle: "0.6h" },
  { zone: "Distribution Centers", visits: "134 / 188", duration: "210 / 440h", avgStay: "4.5h", avgIdle: "1.1h" },
  { zone: "Maintenance Facilities", visits: "89 / 142", duration: "125 / 280h", avgStay: "6.8h", avgIdle: "2.8h" },
  { zone: "Job Sites", visits: "61 / 98", duration: "145 / 240h", avgStay: "5.1h", avgIdle: "1.5h" },
];

const timeLegend = [
  { label: "Driving", color: "var(--utility-brand-500)", hours: "178h", pct: "73%" },
  { label: "Idling", color: "var(--utility-warning-500)", hours: "34h", pct: "14%" },
  { label: "Stopped", color: "var(--utility-error-500)", hours: "23h", pct: "9%" },
  { label: "PTO", color: "var(--utility-gray-300)", hours: "10h", pct: "4%" },
];

// ---------- Page ----------

export default function VehicleDeepDiveDetailPage({ params }: Props) {
  const enter = "fs-animate-enter";
  const [tab, setTab] = useState<TabOption>("Utilization");

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4xl">
      {/* Page header */}
      <div className={enter} style={{ animationDelay: "0ms" }}>
        <PageHeader
          title="Vehicle Deep Dive"
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

      {/* Vehicle info card */}
      <div className={enter} style={{ animationDelay: "60ms" }}>
        <VehicleInfoCard
          title={`Demo - ${params.id.padStart(2, "0")}`}
          subtitle="2026 Unknown Unknown · 2TBNBRC30000000 · GroupA"
          selectedLabel={`Demo - ${params.id.padStart(2, "0")}`}
          kpis={vehicleKpis}
        />
      </div>

      {/* Two ProgressKpiCards */}
      <section
        className={`${enter} grid grid-cols-2 gap-lg`}
        style={{ animationDelay: "120ms" }}
      >
        <ProgressKpiCard
          icon={KpiSmUtilizationIcon}
          iconTone="brand"
          title="Fleet Utilization"
          value="44%"
          progressPct={44}
          trend={{ direction: "up", value: "100%" }}
        />
        <ProgressKpiCard
          icon={KpiSmTimeIcon}
          iconTone="brand"
          title="Days Used"
          value="8/14"
          progressPct={57}
          trend={{ direction: "up", value: "100%" }}
        />
      </section>

      {/* Vehicle Performance Trends — 14-day column chart + mini metrics */}
      <section
        className={`${enter} flex flex-col gap-lg`}
        style={{ animationDelay: "180ms" }}
      >
        <h2 className="text-2xl font-semibold text-text-primary">
          Vehicle Performance Trends
        </h2>
        <div className="flex gap-lg">
          <CardPanel title="Daily Utilization Status" className="flex-1">
            <div className="flex flex-col gap-xs">
              <div className="flex items-center justify-between gap-md px-2xl">
                <TabBar
                  options={TAB_OPTIONS}
                  value={tab}
                  onChange={setTab}
                />
                <ChartLegend
                  items={[
                    { label: "Avg", color: "var(--fg-brand-primary)" },
                  ]}
                />
              </div>
              <div className="p-2xl">
                <UtilizationColumnChart data={daily14} average={70} />
              </div>
            </div>
          </CardPanel>

          <div className="flex w-[370px] flex-col justify-between">
            <MiniMetric label="Utilization Trend" value="+5.2%" suffix="vs last week" />
            <MiniMetric label="Idle Time Ratio" value="5%" suffix="+2.1%" />
            <MiniMetric label="Avg. Trips / Working Day" value="3.2" suffix="+3.7%" />
          </div>
        </div>
      </section>

      {/* Time Breakdown + Performance Trends */}
      <section
        className={`${enter} grid grid-cols-2 gap-lg`}
        style={{ animationDelay: "240ms" }}
      >
        <CardPanel title="Time Breakdown">
          <div className="flex items-center gap-4xl p-2xl">
            <FleetCompositionDonut
              data={timeBreakdown}
              total={245}
              size={196}
            />
            <ul className="flex flex-col gap-md text-sm">
              {timeLegend.map((l) => (
                <li
                  key={l.label}
                  className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-md"
                >
                  <span
                    aria-hidden
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: l.color }}
                  />
                  <span className="text-text-secondary">{l.label}</span>
                  <span className="font-medium text-text-primary">
                    {l.hours}
                  </span>
                  <span className="w-[36px] text-right text-text-tertiary">
                    {l.pct}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </CardPanel>

        <CardPanel
          title="Performance Trends"
          headerExtra={
            <ChartLegend
              items={[
                { label: "Utilization", color: "var(--utility-brand-500)" },
                {
                  label: "Efficiency (MPG)",
                  color: "var(--utility-brand-300)",
                },
              ]}
            />
          }
        >
          <div className="p-2xl">
            <DualAreaLineChart
              data={perfTrends}
              series={[
                {
                  key: "efficiency",
                  name: "Efficiency (MPG)",
                  color: "var(--utility-brand-300)",
                },
                {
                  key: "utilization",
                  name: "Utilization",
                  color: "var(--utility-brand-500)",
                },
              ]}
              yDomain={[0, 150]}
              yTicks={[0, 30, 60, 90, 120, 150]}
              gradientIdPrefix="perf-trends"
            />
          </div>
        </CardPanel>
      </section>

      {/* Activity breakdown — Zone list + Zone Metrics (with Avg Idle column) */}
      <section
        className={`${enter} flex flex-col gap-lg`}
        style={{ animationDelay: "300ms" }}
      >
        <h2 className="text-2xl font-semibold text-text-primary">
          Activity breakdown
        </h2>
        <div className="flex gap-md">
          <CardPanel title="Zone Activity Distribution" className="w-[308px]">
            <div className="p-2xl">
              <ZoneActivityList rows={zoneRows} />
            </div>
          </CardPanel>

          <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border-secondary bg-bg-primary">
            <TableSectionHeader
              title="Zone Activity Metrics"
              searchPlaceholder={null}
            />
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr>
                  <TableHeader className="w-[36%]">Zone</TableHeader>
                  <TableHeader>Visits</TableHeader>
                  <TableHeader>Duration</TableHeader>
                  <TableHeader>Avg Stay</TableHeader>
                  <TableHeader>Avg Idle</TableHeader>
                </tr>
              </thead>
              <tbody>
                {zoneMetrics.map((m) => (
                  <TableRow key={m.zone}>
                    <TableCell className="font-medium text-text-primary">
                      {m.zone}
                    </TableCell>
                    <TableCell className="text-text-tertiary">
                      {m.visits}
                    </TableCell>
                    <TableCell className="text-text-tertiary">
                      {m.duration}
                    </TableCell>
                    <TableCell className="text-text-tertiary">
                      {m.avgStay}
                    </TableCell>
                    <TableCell className="font-semibold text-text-error-primary">
                      {m.avgIdle}
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
}
