"use client";

import {
  PageHeader,
  FilterChip,
  CardPanel,
  GroupSelector,
  GapKpiCard,
  MiniMetric,
  ChartLegend,
  TableSectionHeader,
} from "@/components/ui";
import {
  UtilizationColumnChart,
  DualAreaLineChart,
  ActivityHeatmap,
  HeatmapLegend,
  type ColumnDatum,
  type DualSeriesDatum,
  type HeatmapMatrix,
} from "@/components/charts";
import {
  KpiSmUtilizationIcon,
  KpiSmTimeIcon,
  KpiSmTruckIcon,
  KpiSmOverIcon,
  ChevronDownIcon,
  CalendarIcon,
  FilterLinesIcon,
} from "@/components/icons";

// ---------- Mock data ----------

const CENTRAL = "var(--utility-brand-500)";
const SOUTH = "var(--utility-purple-500)";

// Score Distribution Comparison — 6 buckets, but reused via single-series chart
// (the Figma mock shows grouped bars; here we show dominant series for each
// bucket using the existing UtilizationColumnChart).
const scoreDistribution: ColumnDatum[] = [
  { bucket: "0-50", value: 60, category: "under" },
  { bucket: "51-60", value: 42, category: "optimal" },
  { bucket: "61-70", value: 48, category: "optimal" },
  { bucket: "71-80", value: 38, category: "optimal" },
  { bucket: "81-90", value: 54, category: "over" },
  { bucket: "91-100", value: 68, category: "over" },
];

const dailyAvgScore: DualSeriesDatum[] = Array.from({ length: 10 }, (_, i) => ({
  label: `Jan ${i + 1}`,
  central: 40 + i * 5 + (i % 3) * 4,
  south: 30 + i * 4 + (i % 2) * 3,
}));

const centralHeatmap: HeatmapMatrix = [
  [0, 0, 0, 0, 1, 2, 2, 3, 3, 4, 4, 3, 3, 4, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 3, 4, 4, 3, 3, 4, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 3, 4, 4, 3, 3, 4, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 3, 4, 4, 4, 3, 4, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 3, 3, 2, 2, 3, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const southHeatmap: HeatmapMatrix = [
  [0, 0, 0, 0, 0, 1, 2, 3, 4, 3, 3, 2, 3, 3, 4, 2, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 3, 4, 4, 3, 3, 4, 3, 4, 4, 3, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 3, 4, 4, 3, 4, 4, 4, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 3, 4, 4, 3, 3, 4, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 2, 2, 3, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// ---------- Page ----------

export default function EfficiencyGroupComparisonPage() {
  const enter = "fs-animate-enter";

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4xl">
      {/* Page header */}
      <div className={enter} style={{ animationDelay: "0ms" }}>
        <PageHeader
          title="Efficiency Group Compare"
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

      {/* Group selectors */}
      <div className={enter} style={{ animationDelay: "60ms" }}>
        <GroupSelector
          your={{ label: "Your group", value: "Central Region", color: CENTRAL }}
          other={{ label: "Other group", value: "South Region", color: SOUTH }}
        />
      </div>

      {/* 4 Gap KPI cards */}
      <section
        className={`${enter} grid grid-cols-4 gap-md`}
        style={{ animationDelay: "120ms" }}
      >
        <GapKpiCard
          icon={KpiSmUtilizationIcon}
          iconTone="brand"
          title="Avg Efficiency Score"
          gap="+18%"
          trend={{ direction: "up", value: "5.7%" }}
          rows={[
            { label: "Central", pct: 78, value: "78%", color: CENTRAL },
            { label: "South", pct: 60, value: "60%", color: SOUTH },
          ]}
        />
        <GapKpiCard
          icon={KpiSmTimeIcon}
          iconTone="brand"
          title="Idle Score"
          gap="+18%"
          trend={{ direction: "up", value: "8.3%" }}
          rows={[
            { label: "Central", pct: 78, value: "78%", color: CENTRAL },
            { label: "South", pct: 60, value: "60%", color: SOUTH },
          ]}
        />
        <GapKpiCard
          icon={KpiSmTruckIcon}
          iconTone="brand"
          title="Cruise Use Score"
          gap="+18%"
          trend={{ direction: "up", value: "3.2%" }}
          rows={[
            { label: "Central", pct: 78, value: "78%", color: CENTRAL },
            { label: "South", pct: 60, value: "60%", color: SOUTH },
          ]}
        />
        <GapKpiCard
          icon={KpiSmOverIcon}
          iconTone="brand"
          title="High RPM Score"
          gap="+18%"
          trend={{ direction: "up", value: "6.8%" }}
          rows={[
            { label: "Central", pct: 78, value: "78%", color: CENTRAL },
            { label: "South", pct: 60, value: "60%", color: SOUTH },
          ]}
        />
      </section>

      {/* Score Distribution Comparison + 3 mini metrics */}
      <section
        className={`${enter} flex gap-lg`}
        style={{ animationDelay: "180ms" }}
      >
        <CardPanel title="Score Distribution Comparison" className="flex-1">
          <div className="flex flex-col gap-xs">
            <div className="p-2xl">
              <UtilizationColumnChart data={scoreDistribution} average={50} />
            </div>
          </div>
        </CardPanel>

        <div className="flex w-[370px] flex-col justify-between">
          <MiniMetric label="High Performer Gap" value="Central +42%" suffix="" />
          <MiniMetric label="Needs Coaching" value="20" suffix="+4.2%" />
          <MiniMetric label="Trips / Working Day" value="4.3pt Diff" suffix="+2.9%" />
        </div>
      </section>

      {/* Efficiency Trends — dual area */}
      <section
        className={`${enter} flex flex-col gap-lg`}
        style={{ animationDelay: "240ms" }}
      >
        <h2 className="text-2xl font-semibold text-text-primary">
          Efficiency Trends
        </h2>
        <CardPanel
          title="Daily Avg Score"
          headerExtra={
            <ChartLegend
              items={[
                { label: "Efficiency", color: CENTRAL },
                { label: "Idle", color: SOUTH },
                { label: "RPM", color: "var(--utility-brand-300)" },
                { label: "Cruise", color: "var(--utility-purple-300)" },
              ]}
            />
          }
        >
          <div className="p-2xl">
            <DualAreaLineChart
              data={dailyAvgScore}
              series={[
                { key: "south", name: "South", color: SOUTH },
                { key: "central", name: "Central", color: CENTRAL },
              ]}
              yDomain={[0, 100]}
              yTicks={[0, 20, 40, 60, 80, 100]}
              gradientIdPrefix="eff-compare"
            />
          </div>
        </CardPanel>
      </section>

      {/* Waste Activity Heatmap Comparison */}
      <section
        className={`${enter} overflow-hidden rounded-xl border border-border-secondary bg-bg-primary`}
        style={{ animationDelay: "300ms" }}
      >
        <TableSectionHeader
          title="Waste Activity Heatmap Comparison"
          searchPlaceholder={null}
        />
        <div className="flex items-center justify-between px-3xl pt-xl">
          <FilterChip leftIcon={CalendarIcon}>Jan 1 – Jan 7</FilterChip>
          <HeatmapLegend palette="brand" />
        </div>
        <div className="grid grid-cols-2 gap-lg p-3xl">
          <div className="flex flex-col gap-md">
            <h3 className="text-base font-semibold text-fg-brand-primary">
              Central Region
            </h3>
            <ActivityHeatmap matrix={centralHeatmap} palette="brand" />
          </div>
          <div className="flex flex-col gap-md">
            <h3
              className="text-base font-semibold"
              style={{ color: "var(--utility-purple-600)" }}
            >
              South Region
            </h3>
            <ActivityHeatmap matrix={southHeatmap} palette="purple" />
          </div>
        </div>
      </section>
    </div>
  );
}
