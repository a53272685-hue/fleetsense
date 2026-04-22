"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PageHeader,
  FilterChip,
  QuickAccessCard,
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
  KpiSmErrorIcon,
  KpiSmUtilizationIcon,
  KpiMdMaintenanceIcon,
  KpiSmFileCheckedIcon,
  ChevronDownIcon,
  CalendarIcon,
  FilterLinesIcon,
  SearchLgIcon,
  Trash01Icon,
  Edit02Icon,
} from "@/components/icons";

// ---------- Mock data ----------

type TemplateRow = {
  id: string;
  formName: string;
  region: string;
  type: { label: string; tone: StatusTone };
  group: string;
  fields: number;
  submissions: number;
  pendingRequests: number;
  linkedRules: number;
};

const templateRows: TemplateRow[] = [
  { id: "1", formName: "DVIR", region: "Calgary AB", type: { label: "Inspection", tone: "inspection" }, group: "All Groups", fields: 12, submissions: 542, pendingRequests: 3, linkedRules: 4 },
  { id: "2", formName: "Trip Report", region: "Alberta", type: { label: "Trip", tone: "trip" }, group: "All Groups", fields: 6, submissions: 189, pendingRequests: 1, linkedRules: 1 },
  { id: "3", formName: "Maintenance Req", region: "Manitoba", type: { label: "Maintenance", tone: "maintenance" }, group: "All Groups", fields: 10, submissions: 234, pendingRequests: 20, linkedRules: 5 },
  { id: "4", formName: "Load Report", region: "Alberta", type: { label: "Trip", tone: "trip" }, group: "All Groups", fields: 7, submissions: 156, pendingRequests: 2, linkedRules: 1 },
  { id: "5", formName: "Accident Report", region: "Calgary AB", type: { label: "Safety", tone: "safety" }, group: "All Groups", fields: 18, submissions: 23, pendingRequests: 4, linkedRules: 6 },
  { id: "6", formName: "Safety Checklist", region: "Saskatchewan", type: { label: "Safety", tone: "safety" }, group: "All Groups", fields: 20, submissions: 412, pendingRequests: 0, linkedRules: 5 },
  { id: "7", formName: "Tire Inspection", region: "All Regions", type: { label: "Inspection", tone: "inspection" }, group: "All Groups", fields: 9, submissions: 298, pendingRequests: 0, linkedRules: 2 },
  { id: "8", formName: "Hours Log", region: "All Regions", type: { label: "Inspection", tone: "inspection" }, group: "All Groups", fields: 5, submissions: 678, pendingRequests: 1, linkedRules: 3 },
  { id: "9", formName: "Equipment Check", region: "Manitoba", type: { label: "Inspection", tone: "inspection" }, group: "All Groups", fields: 11, submissions: 145, pendingRequests: 2, linkedRules: 1 },
  { id: "10", formName: "Route Log", region: "Alberta", type: { label: "Trip", tone: "trip" }, group: "All Groups", fields: 6, submissions: 523, pendingRequests: 0, linkedRules: 2 },
];

// ---------- Page ----------

export default function FormTemplatesPage() {
  const enter = "fs-animate-enter";
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4xl">
      <div className={enter} style={{ animationDelay: "0ms" }}>
        <PageHeader
          title="Form Templates"
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

      {/* Quick Access */}
      <section
        className={`${enter} flex flex-col gap-lg`}
        style={{ animationDelay: "60ms" }}
      >
        <h2 className="text-xl font-semibold text-text-primary">Quick Access</h2>
        <div className="grid grid-cols-4 gap-lg">
          <QuickAccessCard
            icon={KpiSmErrorIcon}
            iconTone="error"
            title="Accident Report"
            description="Standardized accident documentation with photo attachments and witness statements"
            lastUsed="2 hours ago"
            href="/forms/templates/accident"
          />
          <QuickAccessCard
            icon={KpiSmUtilizationIcon}
            iconTone="brand"
            title="Fuel Log"
            description="Track fuel purchases, mileage, and consumption rates per vehicle."
            lastUsed="5 hours ago"
            href="/forms/templates/fuel"
          />
          <QuickAccessCard
            icon={KpiMdMaintenanceIcon}
            iconTone="success"
            title="Maintenance Request"
            description="Submit and track vehicle maintenance and repair requests."
            lastUsed="1 day ago"
            href="/forms/templates/maintenance"
          />
          <QuickAccessCard
            icon={KpiSmFileCheckedIcon}
            iconTone="brand"
            title="Safety Checklist"
            description="Pre-trip and post-trip vehicle safety inspection checklists."
            lastUsed="3 days ago"
            href="/forms/templates/safety"
          />
        </div>
      </section>

      {/* All Templates table */}
      <section
        className={`${enter} flex flex-col gap-lg`}
        style={{ animationDelay: "120ms" }}
      >
        <h2 className="text-2xl font-semibold text-text-primary">
          All Templates <span className="text-text-tertiary">(63)</span>
        </h2>
        <div className="flex items-center justify-between gap-md">
          <span className="text-sm font-medium text-text-secondary">Filter by</span>
          <div className="flex flex-1 items-center gap-md">
            <div className="flex items-center gap-md rounded-md border border-border-secondary bg-bg-primary px-[14px] py-[10px]">
              <SearchLgIcon className="h-5 w-5 text-fg-quaternary" />
              <input
                type="search"
                placeholder="Search"
                className="w-[240px] bg-transparent text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none"
              />
            </div>
            <FilterChip rightIcon={ChevronDownIcon}>Type</FilterChip>
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
                <TableHeader className="w-[200px]">Form Name</TableHeader>
                <TableHeader className="w-[120px]">Type</TableHeader>
                <TableHeader className="w-[120px]">Group</TableHeader>
                <TableHeader className="w-[88px]">Fields</TableHeader>
                <TableHeader className="w-[120px]">Submissions</TableHeader>
                <TableHeader className="w-[148px]">Pending Requests</TableHeader>
                <TableHeader className="w-[120px]">Linked Rules</TableHeader>
                <TableHeader className="w-[140px] !px-sm">
                  <span className="sr-only">Actions</span>
                </TableHeader>
              </tr>
            </thead>
            <tbody>
              {templateRows.map((r) => (
                <TableRow
                  key={r.id}
                  interactive
                  onClick={() => {
                    /* stub — open template detail */
                  }}
                  aria-label={`Open template ${r.formName}`}
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
                  <TableCell>
                    <StatusPill tone={r.type.tone}>{r.type.label}</StatusPill>
                  </TableCell>
                  <TableCell className="text-text-tertiary">{r.group}</TableCell>
                  <TableCell className="text-text-tertiary">{r.fields}</TableCell>
                  <TableCell className="text-text-tertiary">{r.submissions}</TableCell>
                  <TableCell className="text-text-tertiary">{r.pendingRequests}</TableCell>
                  <TableCell>
                    <Link
                      href="#"
                      className="text-sm font-semibold text-fg-brand-primary underline"
                    >
                      {r.linkedRules}
                    </Link>
                  </TableCell>
                  <TableCell className="!px-sm">
                    <div className="flex items-center gap-xs">
                      <button
                        type="button"
                        className="rounded-md border border-border-secondary bg-bg-primary px-md py-xs text-xs font-semibold text-text-secondary shadow-xs transition-colors duration-[var(--duration-fast)] hover:bg-bg-primary-hover"
                      >
                        Request
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${r.formName}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-fg-quaternary transition-colors duration-[var(--duration-fast)] hover:bg-bg-primary-hover hover:text-fg-quaternary-hover"
                      >
                        <Trash01Icon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Edit ${r.formName}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-fg-quaternary transition-colors duration-[var(--duration-fast)] hover:bg-bg-primary-hover hover:text-fg-quaternary-hover"
                      >
                        <Edit02Icon className="h-4 w-4" />
                      </button>
                    </div>
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
      </section>
    </div>
  );
}
