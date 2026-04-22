"use client";

import { useState } from "react";
import {
  MetricsCard,
  PageHeader,
  FilterChip,
  CardPanel,
  TabBar,
  MiniMetric,
  ChartLegend,
  TableSectionHeader,
} from "@/components/ui";
import {
  UtilizationColumnChart,
  ActivityHeatmap,
  HeatmapLegend,
  type ColumnDatum,
  type HeatmapMatrix,
} from "@/components/charts";
import {
  KpiSmTimeIcon,
  KpiSmOverIcon,
  KpiSmUtilizationIcon,
  KpiSmTruckIcon,
  ChevronDownIcon,
  CalendarIcon,
  FilterLinesIcon,
} from "@/components/icons";

// ---------- Mock data ----------

const EXCEPTION_TABS = ["Idle", "Speed", "RPM", "Cruise"] as const;
type ExceptionTab = (typeof EXCEPTION_TABS)[number];

// 14-day Daily Avg Score (optimal bars across board).
const dailyAvgScore: ColumnDatum[] = Array.from({ length: 14 }, (_, i) => ({
  bucket: `Jan ${i + 1}`,
  value: 55 + (i % 3) * 8 + (i % 4) * 4,
  category: "optimal",
}));

// 14-day Daily Exception Duration (values in hours, optimal color for consistency).
const dailyException: ColumnDatum[] = Array.from({ length: 14 }, (_, i) => ({
  bucket: `Jan ${i + 1}`,
  value: 2 + (i % 3) * 0.7 + (i % 4) * 0.5,
  category: "optimal",
}));

// Exception Duration Heatmap — same density shape as activity heatmap.
const exceptionHeatmap: HeatmapMatrix = [
  [0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 1, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 2, 2, 1, 2, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 2, 2, 2, 3, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 2, 3, 4, 3, 2, 2, 3, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 1, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// ---------- Page ----------

export default function EfficiencyActivityPage() {
  const enter = "fs-animate-enter";
  const [scoreTab, setScoreTab] = useState<ExceptionTab>("Idle");
  const [exceptionTab, setExceptionTab] = useState<ExceptionTab>("Idle");
  const [heatmapTab, setHeatmapTab] = useState<ExceptionTab>("Idle");

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4xl">
      {/* Page header */}
      <div className={enter} style={{ animationDelay: "0ms" }}>
        <PageHeader
          title="Efficiency Activity"
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
          icon={KpiSmTimeIcon}
          iconTone="brand"
          title="Idle Score"
          value="12%"
          trend={{ direction: "up", value: "7.4%" }}
          meta={[
            { label: "Target", value: "80%" },
            { label: "Avg", value: "74%" },
          ]}
        />
        <MetricsCard
          icon={KpiSmOverIcon}
          iconTone="brand"
          title="Speed Score"
          value="68%"
          trend={{ direction: "up", value: "4.9%" }}
          meta={[
            { label: "Target", value: "80%" },
            { label: "Avg", value: "74%" },
          ]}
        />
        <MetricsCard
          icon={KpiSmUtilizationIcon}
          iconTone="brand"
          title="RPM Score"
          value="70%"
          trend={{ direction: "down", value: "9.3%" }}
          meta={[
            { label: "Target", value: "80%" },
            { label: "Avg", value: "74%" },
          ]}
        />
        <MetricsCard
          icon={KpiSmTruckIcon}
          iconTone="brand"
          title="Cruise Score"
          value="12%"
          trend={{ direction: "up", value: "2.6%" }}
          meta={[
            { label: "Target", value: "80%" },
            { label: "Avg", value: "74%" },
          ]}
        />
      </section>

      {/* Efficiency Trends — Daily Avg Score column chart */}
      <section
        className={`${enter} flex flex-col gap-lg`}
        style={{ animationDelay: "120ms" }}
      >
        <h2 className="text-2xl font-semibold text-text-primary">
          Efficiency Trends
        </h2>
        <CardPanel title="Daily Avg Score">
          <div className="flex flex-col gap-xs">
            <div className="flex items-center justify-between gap-md px-2xl">
              <TabBar
                options={EXCEPTION_TABS}
                value={scoreTab}
                onChange={setScoreTab}
              />
              <ChartLegend
                items={[{ label: "Avg", color: "var(--fg-brand-primary)" }]}
              />
            </div>
            <div className="p-2xl">
              <UtilizationColumnChart data={dailyAvgScore} average={60} />
            </div>
          </div>
        </CardPanel>
      </section>

      {/* Daily Exception Trends — column + 4 mini metrics */}
      <section
        className={`${enter} flex flex-col gap-lg`}
        style={{ animationDelay: "180ms" }}
      >
        <h2 className="text-2xl font-semibold text-text-primary">
          Daily Exception Trends
        </h2>
        <div className="flex gap-lg">
          <CardPanel title="Daily Exception Duration" className="flex-1">
            <div className="flex flex-col gap-xs">
              <div className="flex items-center justify-between gap-md px-2xl">
                <TabBar
                  options={EXCEPTION_TABS}
                  value={exceptionTab}
                  onChange={setExceptionTab}
                />
                <ChartLegend
                  items={[{ label: "Avg", color: "var(--fg-brand-primary)" }]}
                />
              </div>
              <div className="p-2xl">
                <UtilizationColumnChart data={dailyException} average={3} />
              </div>
            </div>
          </CardPanel>

          <div className="flex w-[370px] flex-col justify-between">
            <MiniMetric label="Total Exception Idle" value="12h" suffix="+7.1%" />
            <MiniMetric label="Total Exception Speed" value="2h" suffix="+9.4%" />
            <MiniMetric label="Total Exception RPM" value="1.2h" suffix="+3.6%" />
            <MiniMetric label="Total Exception Cruise" value="3.7h" suffix="+5.8%" />
          </div>
        </div>
      </section>

      {/* Exception Duration Heatmap */}
      <section
        className={`${enter} overflow-hidden rounded-xl border border-border-secondary bg-bg-primary`}
        style={{ animationDelay: "240ms" }}
      >
        <TableSectionHeader title="Exception Duration Heatmap" searchPlaceholder={null} />
        <div className="flex items-center justify-between px-3xl pt-xl">
          <TabBar
            options={EXCEPTION_TABS}
            value={heatmapTab}
            onChange={setHeatmapTab}
          />
          <HeatmapLegend />
        </div>
        <div className="p-3xl">
          <ActivityHeatmap matrix={exceptionHeatmap} />
        </div>
      </section>
    </div>
  );
}
