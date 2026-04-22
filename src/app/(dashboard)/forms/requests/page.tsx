"use client";

import {
  PageHeader,
  FilterChip,
  MetricsCard,
  StatusPill,
  Avatar,
  FileIconBadge,
  type StatusTone,
} from "@/components/ui";
import {
  TableHeader,
  TableCell,
  TableRow,
} from "@/components/tables";
import {
  KpiSmFileBlankIcon,
  KpiSmErrorIcon,
  KpiSmFileCheckedIcon,
  ChevronDownIcon,
  CalendarIcon,
  FilterLinesIcon,
  SearchLgIcon,
} from "@/components/icons";

type RequestRow = {
  id: string;
  formName: string;
  region: string;
  dueDate: string;
  timeToDue: { label: string; tone: StatusTone };
  submittedByInitials: string;
  submittedBy: string;
  assignedToInitials: string;
  assignedTo: string;
  source: { label: string; tone: StatusTone };
  status: { label: string; tone: StatusTone };
};

const rows: RequestRow[] = [
  { id: "1", formName: "Fuel Log", region: "Calgary AB", dueDate: "Jan 5, 2026, 9:00 am", timeToDue: { label: "3days", tone: "due-urgent" }, submittedByInitials: "JM", submittedBy: "John Martinez", assignedToInitials: "SC", assignedTo: "Sarah Chen", source: { label: "In Review", tone: "in-review" }, status: { label: "In Review", tone: "in-review" } },
  { id: "2", formName: "DVIR", region: "Edmonton AB", dueDate: "Jan 3, 2026, 2:15 pm", timeToDue: { label: "5days", tone: "due-urgent" }, submittedByInitials: "DO", submittedBy: "Derek Okafor", assignedToInitials: "LH", assignedTo: "Luis Hernandez", source: { label: "Pending", tone: "pending" }, status: { label: "Pending", tone: "pending" } },
  { id: "3", formName: "Maintenance Req", region: "Winnipeg MB", dueDate: "Jan 6, 2026, 11:30 am", timeToDue: { label: "2days", tone: "due-urgent" }, submittedByInitials: "AP", submittedBy: "Anika Patel", assignedToInitials: "JW", assignedTo: "James Whitfield", source: { label: "Flagged", tone: "flagged" }, status: { label: "Flagged", tone: "flagged" } },
  { id: "4", formName: "Safety Checklist", region: "Regina SK", dueDate: "Jan 7, 2026, 8:45 am", timeToDue: { label: "1day", tone: "due-urgent" }, submittedByInitials: "NK", submittedBy: "Nadia Kowalski", assignedToInitials: "CR", assignedTo: "Carlos Rivera", source: { label: "In Review", tone: "in-review" }, status: { label: "In Review", tone: "in-review" } },
];

export default function FormRequestsPage() {
  const enter = "fs-animate-enter";

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4xl">
      <div className={enter} style={{ animationDelay: "0ms" }}>
        <PageHeader
          title="Form Requests"
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

      {/* 3 KPI cards */}
      <section
        className={`${enter} grid grid-cols-3 gap-lg`}
        style={{ animationDelay: "60ms" }}
      >
        <MetricsCard
          icon={KpiSmFileCheckedIcon}
          iconTone="success"
          title="Pending Requests"
          value="4"
        />
        <MetricsCard
          icon={KpiSmErrorIcon}
          iconTone="error"
          title="Overdue"
          value="2"
        />
        <MetricsCard
          icon={KpiSmFileBlankIcon}
          iconTone="gray"
          title="Completed"
          value="2"
        />
      </section>

      {/* Requested Forms table */}
      <section
        className={`${enter} flex flex-col gap-lg`}
        style={{ animationDelay: "120ms" }}
      >
        <h2 className="text-2xl font-semibold text-text-primary">
          Requested Forms <span className="text-text-tertiary">(4)</span>
        </h2>
        <div className="flex items-center justify-between gap-md">
          <div className="flex items-center gap-md rounded-md border border-border-secondary bg-bg-primary px-[14px] py-[10px]">
            <SearchLgIcon className="h-5 w-5 text-fg-quaternary" />
            <input
              type="search"
              placeholder="Search"
              className="w-[240px] bg-transparent text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-md">
            <button
              type="button"
              className="rounded-md border border-border-secondary bg-bg-primary px-[14px] py-[10px] text-sm font-semibold text-text-secondary shadow-xs hover:bg-bg-primary-hover"
            >
              Request
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-xs rounded-md bg-fg-brand-primary px-[14px] py-[10px] text-sm font-semibold text-white shadow-xs hover:brightness-110 active:scale-[0.98]"
            >
              <span>+</span> Create
            </button>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-border-secondary bg-bg-primary">
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr>
                <TableHeader className="w-[200px]">Form</TableHeader>
                <TableHeader className="w-[180px]">Due Date</TableHeader>
                <TableHeader className="w-[120px]">Time To Due</TableHeader>
                <TableHeader className="w-[200px]">Submitted By</TableHeader>
                <TableHeader className="w-[200px]">Assigned To</TableHeader>
                <TableHeader className="w-[120px]">Source</TableHeader>
                <TableHeader className="w-[120px]">Status</TableHeader>
                <TableHeader className="w-[48px] !px-sm">
                  <span className="sr-only">Detail</span>
                </TableHeader>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <TableRow
                  key={r.id}
                  interactive
                  onClick={() => {
                    /* stub — open request detail */
                  }}
                  aria-label={`Open request ${r.formName}`}
                >
                  <TableCell>
                    <div className="flex items-center gap-md">
                      <FileIconBadge icon={KpiSmFileBlankIcon} />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-text-primary">
                          {r.formName}
                        </span>
                        <span className="text-sm text-text-tertiary">
                          {r.region}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-text-error-primary">
                    {r.dueDate}
                  </TableCell>
                  <TableCell>
                    <StatusPill tone={r.timeToDue.tone}>
                      {r.timeToDue.label}
                    </StatusPill>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-sm">
                      <Avatar initials={r.submittedByInitials} className="h-7 w-7 text-xs" />
                      <span className="text-sm text-text-primary">
                        {r.submittedBy}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-sm">
                      <Avatar initials={r.assignedToInitials} className="h-7 w-7 text-xs" />
                      <span className="text-sm text-text-primary">
                        {r.assignedTo}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusPill tone={r.source.tone}>{r.source.label}</StatusPill>
                  </TableCell>
                  <TableCell>
                    <StatusPill tone={r.status.tone}>{r.status.label}</StatusPill>
                  </TableCell>
                  <TableCell className="!px-sm">
                    <ChevronDownIcon className="h-5 w-5 -rotate-90 text-fg-quaternary" />
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
