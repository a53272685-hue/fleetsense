"use client";

import { useState } from "react";
import {
  MetricsCard,
  AlertBanner,
  PageHeader,
  FilterChip,
  CardPanel,
  ChartLegend,
  MetricCallout,
  TabBar,
  MiniMetric,
  TableSectionHeader,
  Pagination,
} from "@/components/ui";
import {
  UtilizationColumnChart,
  FleetCompositionDonut,
  DailyUtilizationStackedBar,
  type ColumnDatum,
  type CompositionDatum,
  type StackDatum,
} from "@/components/charts";
import {
  FleetVehiclesTable,
  type FleetVehicleRow,
} from "@/components/tables";
import {
  KpiSmUtilizationIcon,
  KpiSmTruckIcon,
  KpiSmTimeIcon,
  ChevronDownIcon,
  CalendarIcon,
  FilterLinesIcon,
} from "@/components/icons";

const densityData: ColumnDatum[] = [
  { bucket: "0", value: 72, category: "inactive" },
  { bucket: "1-10", value: 68, category: "under" },
  { bucket: "11-20", value: 75, category: "under" },
  { bucket: "21-30", value: 65, category: "under" },
  { bucket: "31-40", value: 60, category: "under" },
  { bucket: "41-50", value: 67, category: "optimal" },
  { bucket: "51-60", value: 60, category: "optimal" },
  { bucket: "61-70", value: 60, category: "optimal" },
  { bucket: "71-80", value: 60, category: "optimal" },
  { bucket: "81-90", value: 72, category: "optimal" },
  { bucket: "91-100", value: 80, category: "over" },
];

// Order matches Figma donut clockwise from 12 o'clock:
// Optimal (green) → Under-Utilized (red) → Inactive (gray) → Over-Utilized (orange)
const compositionData: CompositionDatum[] = [
  { label: "Optimal", value: 245 },
  { label: "Under-Utilized", value: 178 },
  { label: "Inactive", value: 62 },
  { label: "Over-Utilized", value: 35 },
];

const legendItems = [
  { label: "Inactive", color: "var(--utility-gray-300)" },
  { label: "Under-utilized", color: "var(--utility-error-500)" },
  { label: "Optimal", color: "var(--utility-success-500)" },
  { label: "Over-utilized", color: "var(--utility-warning-500)" },
];

const dailyStackData: StackDatum[] = [
  { day: "Jan 1", optimal: 30, under: 30, inactive: 30, over: 10 },
  { day: "Jan 2", optimal: 52, under: 20, inactive: 22, over: 6 },
  { day: "Jan 3", optimal: 45, under: 25, inactive: 20, over: 10 },
  { day: "Jan 4", optimal: 38, under: 30, inactive: 25, over: 7 },
  { day: "Jan 5", optimal: 55, under: 18, inactive: 20, over: 7 },
  { day: "Jan 6", optimal: 50, under: 22, inactive: 20, over: 8 },
  { day: "Jan 7", optimal: 48, under: 24, inactive: 22, over: 6 },
];

const DAY_RANGE_OPTIONS = ["7 days", "14 days", "1 month"] as const;
type DayRange = (typeof DAY_RANGE_OPTIONS)[number];

const fleetRows: FleetVehicleRow[] = [
  { id: "1",  code: "F1", name: "Fleet-101", model: "Ford Transit",      utilizationPct: 82, status: { label: "Over",     tone: "over" },     distanceKm: 1245, trips: 12, daysUsed: "13/14", drivingHoursLabel: "189L", idleHours: "0.3 h", fuelL: "204L", mpg: { value: "7.6", tone: "error" } },
  { id: "2",  code: "F0", name: "Fleet-204", model: "RAM ProMaster",     utilizationPct: 61, status: { label: "Moderate", tone: "moderate" }, distanceKm: 634,  trips: 8,  daysUsed: "9/14",  drivingHoursLabel: "312L", idleHours: "3.1 h", fuelL: "287L", mpg: { value: "3.2", tone: "gray" } },
  { id: "3",  code: "F0", name: "Fleet-087", model: "Chevy Express",     utilizationPct: 93, status: { label: "Over",     tone: "over" },     distanceKm: 1892, trips: 18, daysUsed: "14/14", drivingHoursLabel: "245L", idleHours: "0.2 h", fuelL: "231L", mpg: { value: "6.1", tone: "error" } },
  { id: "4",  code: "F3", name: "Fleet-312", model: "Mercedes Spr.",     utilizationPct: 45, status: { label: "Low",      tone: "low" },      distanceKm: 412,  trips: 4,  daysUsed: "6/14",  drivingHoursLabel: "98L",  idleHours: "4.3 h", fuelL: "110L", mpg: { value: "3.4", tone: "warning" } },
  { id: "5",  code: "F1", name: "Fleet-155", model: "Ford E-Transit",    utilizationPct: 78, status: { label: "Optimal",  tone: "optimal" },  distanceKm: 1103, trips: 11, daysUsed: "12/14", drivingHoursLabel: "0L",   idleHours: "0.8 h", fuelL: "0L",   mpg: { value: "7.1", tone: "gray" } },
  { id: "6",  code: "F4", name: "Fleet-443", model: "Isuzu NPR",         utilizationPct: 54, status: { label: "Moderate", tone: "moderate" }, distanceKm: 633,  trips: 5,  daysUsed: "8/14",  drivingHoursLabel: "178L", idleHours: "3.0 h", fuelL: "163L", mpg: { value: "4.6", tone: "warning" } },
  { id: "7",  code: "F0", name: "Fleet-067", model: "International",     utilizationPct: 88, status: { label: "Over",     tone: "over" },     distanceKm: 1567, trips: 15, daysUsed: "13/14", drivingHoursLabel: "298L", idleHours: "0.4 h", fuelL: "276L", mpg: { value: "6.3", tone: "error" } },
  { id: "8",  code: "F2", name: "Fleet-289", model: "Freightliner",      utilizationPct: 37, status: { label: "Low",      tone: "low" },      distanceKm: 298,  trips: 3,  daysUsed: "5/14",  drivingHoursLabel: "156L", idleHours: "5.7 h", fuelL: "142L", mpg: { value: "2.9", tone: "warning" } },
  { id: "9",  code: "F5", name: "Fleet-518", model: "Kenworth",          utilizationPct: 71, status: { label: "Moderate", tone: "moderate" }, distanceKm: 945,  trips: 9,  daysUsed: "10/14", drivingHoursLabel: "410L", idleHours: "1.5 h", fuelL: "388L", mpg: { value: "4.4", tone: "warning" } },
  { id: "10", code: "F0", name: "Fleet-033", model: "Peterbilt",         utilizationPct: 85, status: { label: "Optimal",  tone: "optimal" },  distanceKm: 1410, trips: 14, daysUsed: "12/14", drivingHoursLabel: "375L", idleHours: "0.6 h", fuelL: "350L", mpg: { value: "6.0", tone: "gray" } },
];

export default function UtilizationOverviewPage() {
  const [dayRange, setDayRange] = useState<DayRange>("7 days");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // Page entry: each block gets fs-animate-enter (fade + slide-up 400ms)
  // with a 60ms stagger so the page reveals top-down in a cohesive sweep.
  const enter = "fs-animate-enter";
  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4xl">
      {/* Page header */}
      <div className={enter} style={{ animationDelay: "0ms" }}>
        <PageHeader
          title="Utilization Overview"
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
        <AlertBanner actionLabel="View Vehicles">
          52 vehicles below 50% utilization this week — estimated $8,400 in
          idle asset cost
        </AlertBanner>
      </div>

      {/* KPI row */}
      <section
        className={`${enter} grid grid-cols-3 gap-[13px]`}
        style={{ animationDelay: "120ms" }}
      >
        <MetricsCard
          icon={KpiSmUtilizationIcon}
          iconTone="brand"
          title="Fleet Utilization"
          value="27%"
          trend={{ direction: "up", value: "5.2%" }}
          meta={[
            { label: "Target", value: "80%" },
            { label: "Avg", value: "74%" },
          ]}
        />
        <MetricsCard
          icon={KpiSmTruckIcon}
          iconTone="brand"
          title="Active Assets"
          value="457"
          trend={{ direction: "down", value: "3.1%" }}
          meta={[
            { label: "Target", value: "500" },
            { label: "Avg", value: "487" },
          ]}
        />
        <MetricsCard
          icon={KpiSmTimeIcon}
          iconTone="brand"
          title="Avg. Daily Runtime"
          value="1.95h"
          trend={{ direction: "up", value: "8.5%" }}
          meta={[
            { label: "Target", value: "2h" },
            { label: "Avg", value: "2.1h" },
          ]}
        />
      </section>

      {/* Chart section 1 — Asset Usage Analysis */}
      <section
        className={`${enter} flex flex-col gap-lg`}
        style={{ animationDelay: "180ms" }}
      >
        <h2 className="text-2xl font-semibold text-text-primary">
          Asset Usage Analysis
        </h2>
        <div className="grid grid-cols-2 gap-lg">
          <CardPanel title="Asset Density by Score">
            <div className="flex flex-col gap-xs">
              <div className="px-2xl py-md">
                <ChartLegend items={legendItems} />
              </div>
              <div className="flex flex-col items-center gap-xs p-2xl">
                <UtilizationColumnChart data={densityData} average={50} />
                <p className="text-sm text-text-tertiary">%</p>
              </div>
            </div>
          </CardPanel>

          <CardPanel title="Fleet Composition Status">
            <div className="flex items-center justify-center gap-[60px] p-2xl">
              <FleetCompositionDonut data={compositionData} total={520} />
              <div className="grid grid-cols-2 gap-6xl gap-x-3xl">
                <MetricCallout
                  number={62}
                  label="Inactive"
                  swatchColor="var(--utility-gray-300)"
                />
                <MetricCallout
                  number={245}
                  label="Optimal"
                  swatchColor="var(--utility-success-500)"
                />
                <MetricCallout
                  number={178}
                  label="Under-Utilized"
                  swatchColor="var(--utility-error-500)"
                />
                <MetricCallout
                  number={35}
                  label="Over-Utilized"
                  swatchColor="var(--utility-warning-500)"
                />
              </div>
            </div>
          </CardPanel>
        </div>
      </section>

      {/* Chart section 2 — Asset Utilization Trends */}
      <section
        className={`${enter} flex flex-col gap-lg`}
        style={{ animationDelay: "240ms" }}
      >
        <h2 className="text-2xl font-semibold text-text-primary">
          Asset Utilization Trends
        </h2>
        <div className="flex gap-lg">
          <CardPanel title="Daily Utilization Status" className="flex-1">
            <div className="flex flex-col gap-xs">
              <div className="flex items-center justify-between gap-md px-2xl">
                <TabBar
                  options={DAY_RANGE_OPTIONS}
                  value={dayRange}
                  onChange={setDayRange}
                />
                <ChartLegend items={legendItems} />
              </div>
              <div className="p-2xl">
                <DailyUtilizationStackedBar data={dailyStackData} />
              </div>
            </div>
          </CardPanel>

          {/* justify-between distributes 3 mini cards across full column height
              so first card aligns with chart card top and last card aligns with
              chart card bottom (matches Asset Utilization Trends row height). */}
          <div className="flex w-[370px] flex-col justify-between">
            <MiniMetric label="Utilization Trend" value="+5.2%" />
            <MiniMetric label="Under-utilization Trend" value="-8%" />
            <MiniMetric label="Active Vehicle Rate" value="82%" suffix="+2.1%" />
          </div>
        </div>
      </section>

      {/* Table section — Fleet Vehicles */}
      <section
        className={`${enter} overflow-hidden rounded-xl border border-border-secondary bg-bg-primary`}
        style={{ animationDelay: "300ms" }}
      >
        <TableSectionHeader title="Fleet Vehicles" />
        <FleetVehiclesTable rows={fleetRows} />
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
