"use client";

import {
  PageHeader,
  FilterChip,
  CardPanel,
  GroupSelector,
  GapKpiCard,
  MiniMetric,
  TabBar,
  ChartLegend,
  TableSectionHeader,
} from "@/components/ui";
import {
  GroupedColumnChart,
  ActivityHeatmap,
  HeatmapLegend,
  type GroupedColumnDatum,
  type HeatmapMatrix,
} from "@/components/charts";
import {
  KpiSmUtilizationIcon,
  KpiSmTimeIcon,
  KpiSmTruckIcon,
  ChevronDownIcon,
  CalendarIcon,
  FilterLinesIcon,
} from "@/components/icons";
import { useState } from "react";

// ---------- Mock data ----------

const CENTRAL = "var(--utility-brand-500)";
const SOUTH = "var(--utility-purple-500)";

const TAB_OPTIONS = ["Utilization", "Distribution", "Trips"] as const;
type TabOption = (typeof TAB_OPTIONS)[number];

// 7-day dual column chart data (Jan 1-7).
const dailyCompare: GroupedColumnDatum[] = [
  { label: "Jan 1", central: 58, south: 40 },
  { label: "Jan 2", central: 42, south: 35 },
  { label: "Jan 3", central: 48, south: 38 },
  { label: "Jan 4", central: 45, south: 40 },
  { label: "Jan 5", central: 52, south: 65 },
  { label: "Jan 6", central: 48, south: 72 },
  { label: "Jan 7", central: 50, south: 68 },
];

// Central Region heatmap — business hours cluster (blue palette).
const centralHeatmap: HeatmapMatrix = [
  [0, 0, 0, 0, 1, 2, 2, 3, 3, 4, 4, 3, 3, 4, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 3, 4, 4, 3, 3, 4, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 3, 4, 4, 3, 3, 4, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 3, 4, 4, 4, 3, 4, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 3, 3, 2, 2, 3, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// South Region heatmap — slightly different shape (purple palette).
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

export default function GroupComparisonPage() {
  const enter = "fs-animate-enter";
  const [tab, setTab] = useState<TabOption>("Utilization");

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4xl">
      {/* Page header */}
      <div className={enter} style={{ animationDelay: "0ms" }}>
        <PageHeader
          title="Utilization Group Compare"
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
          your={{
            label: "Your group",
            value: "Central Region",
            color: CENTRAL,
          }}
          other={{
            label: "Other group",
            value: "South Region",
            color: SOUTH,
          }}
        />
      </div>

      {/* 3 Gap KPI cards */}
      <section
        className={`${enter} grid grid-cols-3 gap-lg`}
        style={{ animationDelay: "120ms" }}
      >
        <GapKpiCard
          icon={KpiSmUtilizationIcon}
          iconTone="brand"
          title="Fleet Utilization Gap"
          gap="+18%"
          trend={{ direction: "up", value: "6.4%" }}
          rows={[
            { label: "Central", pct: 78, value: "78%", color: CENTRAL },
            { label: "South", pct: 60, value: "60%", color: SOUTH },
          ]}
        />
        <GapKpiCard
          icon={KpiSmTimeIcon}
          iconTone="brand"
          title="Idle Time Gap"
          gap="+0.2h"
          trend={{ direction: "up", value: "2.8%" }}
          rows={[
            { label: "Central", pct: 65, value: "1.3h", color: CENTRAL },
            { label: "South", pct: 55, value: "1.1h", color: SOUTH },
          ]}
        />
        <GapKpiCard
          icon={KpiSmTruckIcon}
          iconTone="brand"
          title="Under-utilized Assets Gap"
          gap="+2"
          trend={{ direction: "up", value: "4.1%" }}
          rows={[
            { label: "Central", pct: 60, value: "6", color: CENTRAL },
            { label: "South", pct: 40, value: "4", color: SOUTH },
          ]}
        />
      </section>

      {/* Daily Utilization Status (grouped bars) + 3 mini metrics */}
      <section
        className={`${enter} flex gap-lg`}
        style={{ animationDelay: "180ms" }}
      >
        <CardPanel title="Daily Utilization Status" className="flex-1">
          <div className="flex flex-col gap-xs">
            <div className="flex items-center justify-between gap-md px-2xl">
              <TabBar options={TAB_OPTIONS} value={tab} onChange={setTab} />
              <ChartLegend
                items={[{ label: "Avg", color: "var(--fg-brand-primary)" }]}
              />
            </div>
            <div className="p-2xl">
              <GroupedColumnChart
                data={dailyCompare}
                series={[
                  { key: "central", name: "Central Region", color: CENTRAL },
                  { key: "south", name: "South Region", color: SOUTH },
                ]}
                average={50}
              />
            </div>
          </div>
        </CardPanel>

        <div className="flex w-[370px] flex-col justify-between">
          <MiniMetric label="Utilization Trend" value="+5.2%" suffix="vs last week" />
          <MiniMetric label="Idle Time Ratio" value="5%" suffix="+2.1%" />
          <MiniMetric label="Avg. Trips / Working Day" value="3.2" suffix="+3.7%" />
        </div>
      </section>

      {/* Groups Performance Trends — dual heatmaps */}
      <section
        className={`${enter} flex flex-col gap-lg`}
        style={{ animationDelay: "240ms" }}
      >
        <h2 className="text-2xl font-semibold text-text-primary">
          Groups Performance Trends
        </h2>
        <section className="overflow-hidden rounded-xl border border-border-secondary bg-bg-primary">
          <TableSectionHeader title="Activity Heatmap" searchPlaceholder={null} />
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
      </section>
    </div>
  );
}
