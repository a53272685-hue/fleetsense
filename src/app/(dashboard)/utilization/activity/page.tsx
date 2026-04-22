"use client";

import {
  MetricsCard,
  PageHeader,
  FilterChip,
  CardPanel,
  ZoneActivityList,
  TableSectionHeader,
  type ZoneActivityRow,
} from "@/components/ui";
import {
  AreaLineChart,
  ActivityHeatmap,
  HeatmapLegend,
  type AreaLineDatum,
  type HeatmapMatrix,
} from "@/components/charts";
import {
  TableHeader,
  TableCell,
  TableRow,
} from "@/components/tables";
import {
  KpiSmTruckIcon,
  KpiExchangeIcon,
  KpiSmTripIcon,
  KpiSmTimeIcon,
  ChevronDownIcon,
  CalendarIcon,
  FilterLinesIcon,
} from "@/components/icons";

// ---------- Mock data ----------

const milesSeries: AreaLineDatum[] = [
  { label: "Jan 1", value: 420 },
  { label: "Jan 2", value: 540 },
  { label: "Jan 3", value: 610 },
  { label: "Jan 4", value: 520 },
  { label: "Jan 5", value: 690 },
  { label: "Jan 6", value: 780 },
  { label: "Jan 7", value: 1020 },
  { label: "Jan 8", value: 1150 },
  { label: "Jan 9", value: 1380 },
  { label: "Jan 10", value: 1540 },
  { label: "Jan 11", value: 1720 },
  { label: "Jan 12", value: 1890 },
  { label: "Jan 13", value: 2100 },
  { label: "Jan 14", value: 2340 },
];

const tripsSeries: AreaLineDatum[] = [
  { label: "Jan 1", value: 20 },
  { label: "Jan 2", value: 28 },
  { label: "Jan 3", value: 32 },
  { label: "Jan 4", value: 30 },
  { label: "Jan 5", value: 42 },
  { label: "Jan 6", value: 50 },
  { label: "Jan 7", value: 58 },
  { label: "Jan 8", value: 68 },
  { label: "Jan 9", value: 82 },
  { label: "Jan 10", value: 94 },
  { label: "Jan 11", value: 104 },
  { label: "Jan 12", value: 118 },
  { label: "Jan 13", value: 128 },
  { label: "Jan 14", value: 140 },
];

const zoneRows: ZoneActivityRow[] = [
  { label: "Customer Sites", pct: 38.2 },
  { label: "Distribution Centers", pct: 27.5 },
  { label: "Maintenance Facilities", pct: 18.8 },
  { label: "Job Sites", pct: 15.5 },
];

type ZoneMetricRow = {
  zone: string;
  visits: string;
  duration: string;
  avgStay: string;
  /** Red-highlighted avgStay (e.g. over-long stays). */
  avgStayTone?: "default" | "error";
};

// Avg Stay values match Figma main (gray) column.
// The red subvalues (1.2h/2.4h/1.9h) in the Figma mock appear to belong to
// a separate delta/wait column not yet implemented — revisit if added.
const zoneMetrics: ZoneMetricRow[] = [
  { zone: "Customer Sites", visits: "186 / 248", duration: "312 / 680h", avgStay: "4.2h" },
  { zone: "Distribution Centers", visits: "142 / 195", duration: "198 / 480h", avgStay: "3.8h" },
  { zone: "Maintenance Facilities", visits: "98 / 156", duration: "145 / 320h", avgStay: "6.1h" },
  { zone: "Job Sites", visits: "78 / 112", duration: "165 / 290h", avgStay: "5.3h" },
];

// 7 rows × 24 cols heatmap (Mon→Sun, 00→23).
// Peak clustered around business hours (07-16) Tue-Thu, weekends quiet.
const heatmap: HeatmapMatrix = [
  [0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 1, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 2, 2, 1, 2, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 2, 2, 2, 3, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 2, 3, 4, 3, 2, 2, 3, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 1, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// ---------- Page ----------

export default function UtilizationActivityPage() {
  const enter = "fs-animate-enter";

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4xl">
      {/* Page header */}
      <div className={enter} style={{ animationDelay: "0ms" }}>
        <PageHeader
          title="Utilization Activity"
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

      {/* KPI row (4 cards) */}
      <section
        className={`${enter} grid grid-cols-4 gap-[13px]`}
        style={{ animationDelay: "60ms" }}
      >
        <MetricsCard
          icon={KpiSmTruckIcon}
          iconTone="brand"
          title="Engine Hours"
          value="3.90 h"
          trend={{ direction: "up", value: "4.3%" }}
          meta={[
            { label: "Target", value: "6h/day" },
            { label: "Avg", value: "4.8h" },
          ]}
        />
        <MetricsCard
          icon={KpiExchangeIcon}
          iconTone="brand"
          title="Total Fleet Miles"
          value="110.36"
          trend={{ direction: "down", value: "2.7%" }}
          meta={[
            { label: "Target", value: "150 mi" },
            { label: "Avg", value: "95 mi" },
          ]}
        />
        <MetricsCard
          icon={KpiSmTripIcon}
          iconTone="brand"
          title="Total Fleet Trips"
          value="51.34"
          trend={{ direction: "up", value: "6.1%" }}
          meta={[
            { label: "Target", value: "60/day" },
            { label: "Avg", value: "45" },
          ]}
        />
        <MetricsCard
          icon={KpiSmTimeIcon}
          iconTone="brand"
          title="Total Idle Time"
          value="1.1h"
          trend={{ direction: "up", value: "3.9%" }}
          meta={[
            { label: "Target", value: "< 0.5h" },
            { label: "Avg", value: "1.3h" },
          ]}
        />
      </section>

      {/* Asset Activity Trends — 2 area line charts */}
      <section
        className={`${enter} flex flex-col gap-lg`}
        style={{ animationDelay: "120ms" }}
      >
        <h2 className="text-2xl font-semibold text-text-primary">
          Asset Activity Trends
        </h2>
        <div className="grid grid-cols-2 gap-lg">
          <CardPanel
            title="Daily Fleet Miles"
            headerExtra={
              <span className="text-sm font-normal text-text-tertiary">
                Jan 1 - Jan 14
              </span>
            }
          >
            <div className="p-2xl">
              <AreaLineChart
                data={milesSeries}
                yDomain={[0, 2500]}
                yTicks={[0, 500, 1000, 1500, 2000, 2500]}
                gradientId="area-miles"
                valueSuffix=" mi"
              />
            </div>
          </CardPanel>

          <CardPanel
            title="Daily Fleet Trips"
            headerExtra={
              <span className="text-sm font-normal text-text-tertiary">
                Jan 1 - Jan 14
              </span>
            }
          >
            <div className="p-2xl">
              <AreaLineChart
                data={tripsSeries}
                yDomain={[0, 150]}
                yTicks={[0, 30, 60, 90, 120, 150]}
                gradientId="area-trips"
                valueSuffix=" trips"
              />
            </div>
          </CardPanel>
        </div>
      </section>

      {/* Activity breakdown — Distribution list + Metrics table */}
      <section
        className={`${enter} flex flex-col gap-lg`}
        style={{ animationDelay: "180ms" }}
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
                  <TableHeader className="w-[40%]">Zone</TableHeader>
                  <TableHeader>Visits</TableHeader>
                  <TableHeader>Duration</TableHeader>
                  <TableHeader>Avg Stay</TableHeader>
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
                    <TableCell
                      className={
                        m.avgStayTone === "error"
                          ? "font-semibold text-text-error-primary"
                          : "text-text-tertiary"
                      }
                    >
                      {m.avgStay}
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Activity Heatmap */}
      <section
        className={`${enter} overflow-hidden rounded-xl border border-border-secondary bg-bg-primary`}
        style={{ animationDelay: "240ms" }}
      >
        <TableSectionHeader title="Activity Heatmap" searchPlaceholder={null} />
        <div className="flex items-center justify-between px-3xl pt-xl">
          <FilterChip leftIcon={CalendarIcon}>Jan 1 – Jan 7</FilterChip>
          <HeatmapLegend />
        </div>
        <div className="p-3xl">
          <ActivityHeatmap matrix={heatmap} />
        </div>
      </section>
    </div>
  );
}
