"use client";

import { useState } from "react";
import {
  PageHeader,
  FilterChip,
  MetricsCard,
  AlertBanner,
  Avatar,
  StatusPill,
  FileIconBadge,
  Pagination,
  type StatusTone,
} from "@/components/ui";
import {
  TableHeader,
  TableCell,
  TableRow,
} from "@/components/tables";
import {
  KpiSmFileBlankIcon,
  KpiSmFileCheckedIcon,
  KpiSmErrorIcon,
  ChevronDownIcon,
  CalendarIcon,
  FilterLinesIcon,
  SearchLgIcon,
} from "@/components/icons";

// ---------- Mock data ----------

type SubmissionRow = {
  id: string;
  date: string;
  formName: string;
  formLocation: string;
  type: { label: string; tone: StatusTone };
  submittedByInitials: string;
  submittedBy: string;
  vehicle: string;
  source: { label: string; tone: StatusTone };
  status: { label: string; tone: StatusTone };
};

const submissionRows: SubmissionRow[] = [
  { id: "1", date: "Jan 6, 9:15 am", formName: "Fuel Log", formLocation: "Calgary AB", type: { label: "Fuel", tone: "fuel" }, submittedByInitials: "JM", submittedBy: "John Martinez", vehicle: "Fleet-101", source: { label: "Manual", tone: "manual" }, status: { label: "Pending", tone: "pending" } },
  { id: "2", date: "Jan 6, 11:42 am", formName: "Safety Checklist", formLocation: "Edmonton AB", type: { label: "Inspection", tone: "inspection" }, submittedByInitials: "PS", submittedBy: "Priya Sandhu", vehicle: "Fleet-087", source: { label: "Mobile", tone: "mobile" }, status: { label: "In Review", tone: "in-review" } },
  { id: "3", date: "Jan 6, 2:30 pm", formName: "Trip Report", formLocation: "Winnipeg MB", type: { label: "Trip", tone: "trip" }, submittedByInitials: "DO", submittedBy: "Derek Okafor", vehicle: "Fleet-204", source: { label: "Auto", tone: "auto" }, status: { label: "Approved", tone: "approved" } },
  { id: "4", date: "Jan 7, 7:58 am", formName: "Incident Report", formLocation: "Regina SK", type: { label: "Safety", tone: "safety" }, submittedByInitials: "LH", submittedBy: "Luis Hernandez", vehicle: "Fleet-155", source: { label: "Manual", tone: "manual" }, status: { label: "Pending", tone: "pending" } },
  { id: "5", date: "Jan 7, 10:05 am", formName: "Fuel Log", formLocation: "Lethbridge AB", type: { label: "Fuel", tone: "fuel" }, submittedByInitials: "AP", submittedBy: "Anika Patel", vehicle: "Fleet-312", source: { label: "Mobile", tone: "mobile" }, status: { label: "In Review", tone: "in-review" } },
  { id: "6", date: "Jan 7, 1:22 pm", formName: "Maintenance Req", formLocation: "Saskatoon SK", type: { label: "Maintenance", tone: "maintenance" }, submittedByInitials: "SC", submittedBy: "Sarah Chen", vehicle: "Fleet-443", source: { label: "Manual", tone: "manual" }, status: { label: "Pending", tone: "pending" } },
  { id: "7", date: "Jan 8, 10:35 am", formName: "Fuel Log", formLocation: "Moose Jaw SK", type: { label: "Fuel", tone: "fuel" }, submittedByInitials: "CR", submittedBy: "Carlos Rivera", vehicle: "Fleet-518", source: { label: "Auto", tone: "auto" }, status: { label: "Pending", tone: "pending" } },
  { id: "8", date: "Jan 8, 3:15 pm", formName: "Safety Checklist", formLocation: "Medicine Hat AB", type: { label: "Safety", tone: "safety" }, submittedByInitials: "EJ", submittedBy: "Emma Johnson", vehicle: "Fleet-033", source: { label: "Mobile", tone: "mobile" }, status: { label: "In Review", tone: "in-review" } },
  { id: "9", date: "Jan 7, 3:47 pm", formName: "DVIR", formLocation: "Red Deer AB", type: { label: "Inspection", tone: "inspection" }, submittedByInitials: "JW", submittedBy: "James Whitfield", vehicle: "Fleet-067", source: { label: "Auto", tone: "auto" }, status: { label: "In Review", tone: "in-review" } },
  { id: "10", date: "Jan 8, 8:10 am", formName: "Trip Report", formLocation: "Brandon MB", type: { label: "Trip", tone: "trip" }, submittedByInitials: "NK", submittedBy: "Nadia Kowalski", vehicle: "Fleet-289", source: { label: "Mobile", tone: "mobile" }, status: { label: "In Review", tone: "in-review" } },
];

// ---------- Page ----------

export default function FormSubmissionsPage() {
  const enter = "fs-animate-enter";
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4xl">
      <div className={enter} style={{ animationDelay: "0ms" }}>
        <PageHeader
          title="Form Submissions"
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

      {/* Alert */}
      <div className={enter} style={{ animationDelay: "60ms" }}>
        <AlertBanner actionLabel="Review Now">
          9 form submissions pending review for over 48 hours — 3 flagged items
          require immediate attention
        </AlertBanner>
      </div>

      {/* 3 KPI cards */}
      <section
        className={`${enter} grid grid-cols-3 gap-lg`}
        style={{ animationDelay: "120ms" }}
      >
        <MetricsCard
          icon={KpiSmFileBlankIcon}
          iconTone="gray"
          title="Total Submissions"
          value="15"
        />
        <MetricsCard
          icon={KpiSmFileCheckedIcon}
          iconTone="success"
          title="Pending Review"
          value="9"
        />
        <MetricsCard
          icon={KpiSmErrorIcon}
          iconTone="error"
          title="Flagged Items"
          value="3"
        />
      </section>

      {/* Submissions In Progress table */}
      <section
        className={`${enter} flex flex-col gap-lg`}
        style={{ animationDelay: "180ms" }}
      >
        <h2 className="text-2xl font-semibold text-text-primary">
          Submissions In Progress{" "}
          <span className="text-text-tertiary">(15)</span>
        </h2>
        <div className="flex flex-col gap-lg">
          <div className="flex items-center justify-between gap-md">
            <span className="text-sm font-medium text-text-secondary">
              Filter by
            </span>
            <div className="flex flex-1 items-center gap-md">
              <div className="flex">
                <FilterChip segment="left" rightIcon={ChevronDownIcon}>
                  Last 7 days
                </FilterChip>
                <FilterChip segment="right" leftIcon={CalendarIcon}>
                  Jan 1 – Jan 7
                </FilterChip>
              </div>
              <FilterChip rightIcon={ChevronDownIcon}>Status</FilterChip>
              <FilterChip rightIcon={ChevronDownIcon}>Type</FilterChip>
              <div className="flex items-center gap-md rounded-md border border-border-secondary bg-bg-primary px-[14px] py-[10px]">
                <SearchLgIcon className="h-5 w-5 text-fg-quaternary" />
                <input
                  type="search"
                  placeholder="Search"
                  className="w-[200px] bg-transparent text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-md">
              <button
                type="button"
                className="rounded-md border border-border-secondary bg-bg-primary px-[14px] py-[10px] text-sm font-semibold text-text-secondary shadow-xs transition-colors duration-[var(--duration-fast)] hover:bg-bg-primary-hover"
              >
                Request
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-xs rounded-md bg-fg-brand-primary px-[14px] py-[10px] text-sm font-semibold text-white shadow-xs transition-[background-color,transform] duration-[var(--duration-fast)] hover:brightness-110 active:scale-[0.98]"
              >
                <span>+</span> Create
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border-secondary bg-bg-primary">
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr>
                  <TableHeader className="w-[150px]">Date</TableHeader>
                  <TableHeader>Form Details</TableHeader>
                  <TableHeader className="w-[120px]">Type</TableHeader>
                  <TableHeader className="w-[200px]">Submitted By</TableHeader>
                  <TableHeader className="w-[110px]">Vehicle</TableHeader>
                  <TableHeader className="w-[100px]">Source</TableHeader>
                  <TableHeader className="w-[120px]">Status</TableHeader>
                </tr>
              </thead>
              <tbody>
                {submissionRows.map((r) => (
                  <TableRow
                    key={r.id}
                    interactive
                    onClick={() => {
                      /* stub — open submission detail */
                    }}
                    aria-label={`Open submission ${r.formName} by ${r.submittedBy}`}
                  >
                    <TableCell className="text-text-tertiary">{r.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-md">
                        <FileIconBadge icon={KpiSmFileBlankIcon} />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-text-primary">
                            {r.formName}
                          </span>
                          <span className="text-sm text-text-tertiary">
                            {r.formLocation}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusPill tone={r.type.tone}>{r.type.label}</StatusPill>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-sm">
                        <Avatar initials={r.submittedByInitials} className="h-7 w-7 text-xs" />
                        <span className="text-sm text-text-primary">
                          {r.submittedBy}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-text-tertiary">
                      {r.vehicle}
                    </TableCell>
                    <TableCell>
                      <StatusPill tone={r.source.tone}>{r.source.label}</StatusPill>
                    </TableCell>
                    <TableCell>
                      <StatusPill tone={r.status.tone}>{r.status.label}</StatusPill>
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
          </div>
        </div>
      </section>
    </div>
  );
}
