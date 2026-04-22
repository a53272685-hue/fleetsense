"use client";

import {
  PageHeader,
  FilterChip,
  CardPanel,
  MetricsCard,
  DriverInfoCard,
  EfficiencyLossList,
  TableSectionHeader,
  ChartLegend,
  type EfficiencyLossItem,
} from "@/components/ui";
import {
  TimeBreakdownDonut,
  DualAreaLineChart,
  type TimeBreakdownDatum,
  type DualSeriesDatum,
} from "@/components/charts";
import {
  TableHeader,
  TableCell,
  TableRow,
} from "@/components/tables";
import {
  KpiSmTimeIcon,
  KpiSmOverIcon,
  KpiSmUtilizationIcon,
  KpiSmTruckIcon,
  ChevronDownIcon,
  CalendarIcon,
  FilterLinesIcon,
  SearchLgIcon,
} from "@/components/icons";

type Props = { params: { id: string } };

// ---------- Mock data ----------

const timeBreakdown: TimeBreakdownDatum[] = [
  { label: "Driving", value: 275 },
  { label: "Idling", value: 36 },
  { label: "Stopped", value: 32 },
  { label: "PTO", value: 13 },
];

const timeLegend = [
  { label: "Driving", color: "var(--utility-brand-500)", hours: "275h", pct: "77%" },
  { label: "Idling", color: "var(--utility-warning-500)", hours: "36h", pct: "10%" },
  { label: "Stopped", color: "var(--utility-error-500)", hours: "32h", pct: "9%" },
  { label: "PTO", color: "var(--utility-gray-300)", hours: "13h", pct: "4%" },
];

const perfTrend: DualSeriesDatum[] = Array.from({ length: 14 }, (_, i) => ({
  label: `Jan ${i + 1}`,
  utilization: 40 + i * 4 + (i % 3) * 3,
  efficiency: 30 + i * 3 + (i % 2) * 5,
}));

type IdleEvent = {
  date: string;
  time: string;
  location: string;
  duration: string;
  avgIdle: string;
};

const idleEvents: IdleEvent[] = [
  { date: "Jan 3, 2026", time: "08:42 am", location: "Depot Loading Dock", duration: "45m", avgIdle: "$3.50" },
  { date: "Jan 4, 2026", time: "12:18 pm", location: "Highway Rest Stop", duration: "28m", avgIdle: "$2.15" },
  { date: "Jan 5, 2026", time: "03:05 pm", location: "Customer Site - Gate", duration: "62m", avgIdle: "$4.80" },
  { date: "Jan 6, 2026", time: "09:30 am", location: "Distribution Center", duration: "15m", avgIdle: "$1.20" },
];

const lossSegments: EfficiencyLossItem[] = [
  { label: "High Speed on I-95", amount: "$ 12.5" },
  { label: "Excessive RPM in City", amount: "$ 4.2" },
  { label: "Idling at Depot", amount: "$ 6.75" },
];

// ---------- Page ----------

export default function DriverDeepDivePage({ params }: Props) {
  const enter = "fs-animate-enter";

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4xl">
      {/* Page header */}
      <div className={enter} style={{ animationDelay: "0ms" }}>
        <PageHeader
          title="Driver Deep Dive"
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

      {/* Search + Selected Driver dropdown */}
      <div
        className={`${enter} flex items-center gap-lg`}
        style={{ animationDelay: "60ms" }}
      >
        <div className="flex flex-1 items-center gap-md rounded-md border border-border-secondary bg-bg-primary px-[14px] py-[10px]">
          <SearchLgIcon className="h-5 w-5 text-fg-quaternary" />
          <input
            type="search"
            placeholder="Search"
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none"
          />
        </div>
        <button
          type="button"
          className="inline-flex h-10 min-w-[320px] items-center justify-between gap-md rounded-md border border-border-secondary bg-bg-primary px-[14px] text-sm font-medium text-text-tertiary shadow-xs transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-fast)] hover:bg-bg-primary-hover"
        >
          <span>Selected Driver</span>
          <ChevronDownIcon className="h-4 w-4 text-fg-quaternary" />
        </button>
      </div>

      {/* Selected Driver Report */}
      <section
        className={`${enter} flex flex-col gap-lg`}
        style={{ animationDelay: "120ms" }}
      >
        <h2 className="text-2xl font-semibold text-text-primary">
          Selected Driver Report
        </h2>
        <DriverInfoCard
          initials="JL"
          name="Jardan Lee"
          role={`Delivery Driver · North Region · #${params.id}`}
          tags={["Truck 006", "Van 006"]}
          score={{
            value: "92%",
            trend: { direction: "up", value: "6.3%" },
          }}
        />
      </section>

      {/* Key Metrics — 4 KPI cards */}
      <section
        className={`${enter} flex flex-col gap-lg`}
        style={{ animationDelay: "180ms" }}
      >
        <h2 className="text-2xl font-semibold text-text-primary">Key Metrics</h2>
        <div className="grid grid-cols-4 gap-[13px]">
          <MetricsCard
            icon={KpiSmTimeIcon}
            iconTone="brand"
            title="Avoidable Idle"
            value="2h"
            trend={{ direction: "down", value: "8.3%" }}
            meta={[
              { label: "Target", value: "0.5h" },
              { label: "Avg", value: "1.1h" },
            ]}
          />
          <MetricsCard
            icon={KpiSmOverIcon}
            iconTone="brand"
            title="Over Speeding"
            value="0.5%"
            trend={{ direction: "up", value: "12.1%" }}
            meta={[
              { label: "Target", value: "0.4%" },
              { label: "Avg", value: "0.8%" },
            ]}
          />
          <MetricsCard
            icon={KpiSmUtilizationIcon}
            iconTone="brand"
            title="High RPM Score"
            value="1.2%"
            trend={{ direction: "down", value: "5.6%" }}
            meta={[
              { label: "Target", value: "<5%" },
              { label: "Avg", value: "3%" },
            ]}
          />
          <MetricsCard
            icon={KpiSmTruckIcon}
            iconTone="brand"
            title="Cruise Control"
            value="68%"
            trend={{ direction: "up", value: "3.8%" }}
            meta={[
              { label: "Target", value: ">65%" },
              { label: "Avg", value: "71%" },
            ]}
          />
        </div>
      </section>

      {/* Time Breakdown donut + Efficiency Trend dual area */}
      <section
        className={`${enter} grid grid-cols-2 gap-lg`}
        style={{ animationDelay: "240ms" }}
      >
        <CardPanel title="Time Breakdown">
          <div className="flex items-center gap-4xl p-2xl">
            <TimeBreakdownDonut data={timeBreakdown} total={356} size={196} />
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
                  <span className="font-medium text-text-primary">{l.hours}</span>
                  <span className="w-[36px] text-right text-text-tertiary">
                    {l.pct}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </CardPanel>

        <CardPanel
          title="Efficiency Trend"
          headerExtra={
            <ChartLegend
              items={[
                { label: "Utilization", color: "var(--utility-brand-500)" },
                { label: "Efficiency (MPG)", color: "var(--utility-brand-300)" },
              ]}
            />
          }
        >
          <div className="p-2xl">
            <DualAreaLineChart
              data={perfTrend}
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
              gradientIdPrefix="driver-eff"
            />
          </div>
        </CardPanel>
      </section>

      {/* Total Idle Waste Event + Efficiency Loss Segments */}
      <section
        className={`${enter} grid grid-cols-[1fr_340px] gap-lg`}
        style={{ animationDelay: "300ms" }}
      >
        <div className="flex flex-col overflow-hidden rounded-xl border border-border-secondary bg-bg-primary">
          <TableSectionHeader
            title="Total Idle Waste Event"
            searchPlaceholder={null}
          />
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr>
                <TableHeader className="w-[30%]">Time</TableHeader>
                <TableHeader>Location</TableHeader>
                <TableHeader>Duration</TableHeader>
                <TableHeader>Avg Idle</TableHeader>
              </tr>
            </thead>
            <tbody>
              {idleEvents.map((e) => (
                <TableRow key={e.date + e.time}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-text-primary">
                        {e.date}
                      </span>
                      <span className="text-sm text-text-tertiary">
                        {e.time}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-text-tertiary">
                    {e.location}
                  </TableCell>
                  <TableCell className="font-medium text-text-primary">
                    {e.duration}
                  </TableCell>
                  <TableCell className="font-semibold text-text-error-primary">
                    {e.avgIdle}
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col overflow-hidden rounded-xl border border-border-secondary bg-bg-primary">
          <TableSectionHeader
            title="Efficiency Loss Segments"
            searchPlaceholder={null}
          />
          <EfficiencyLossList items={lossSegments} />
        </div>
      </section>
    </div>
  );
}
