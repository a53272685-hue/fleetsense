import {
  NavUtilizationIcon,
  NavEfficiencyIcon,
  NavComplianceIcon,
  NavFormsIcon,
  NavDeepDiveIcon,
} from "@/components/icons";
import type { ComponentType, SVGProps } from "react";

export type NavItem = {
  label: string;
  href: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
};

export const ROW_A: NavItem[] = [
  { label: "Utilization", href: "/utilization/overview", icon: NavUtilizationIcon },
  { label: "Efficiency", href: "/efficiency/overview", icon: NavEfficiencyIcon },
  { label: "Compliance", href: "/compliance/overview", icon: NavComplianceIcon },
  { label: "Forms", href: "/forms/submissions", icon: NavFormsIcon },
  { label: "Deep Dive", href: "/deep-dive/drivers", icon: NavDeepDiveIcon },
];

export const ROW_B = {
  utilization: [
    { label: "Overview", href: "/utilization/overview" },
    { label: "Activity", href: "/utilization/activity" },
    { label: "Vehicle Deep Dive", href: "/utilization/vehicle-deep-dive" },
    { label: "Group Compare", href: "/utilization/group-comparison" },
  ] satisfies NavItem[],
  efficiency: [
    { label: "Overview", href: "/efficiency/overview" },
    { label: "Activity", href: "/efficiency/activity" },
    { label: "Driver Deep Dive", href: "/efficiency/driver-deep-dive" },
    { label: "Group Compare", href: "/efficiency/group-comparison" },
  ] satisfies NavItem[],
  compliance: [
    { label: "Overview", href: "/compliance/overview" },
    { label: "CSA", href: "/compliance/csa" },
    { label: "Maintenance", href: "/compliance/maintenance" },
    { label: "House of Service", href: "/compliance/hos" },
  ] satisfies NavItem[],
  forms: [
    { label: "Submissions", href: "/forms/submissions" },
    { label: "Templates", href: "/forms/templates" },
    { label: "Requests", href: "/forms/requests" },
  ] satisfies NavItem[],
  "deep-dive": [
    { label: "Drivers", href: "/deep-dive/drivers" },
    { label: "Lytx Safety", href: "/deep-dive/lytx-safety" },
  ] satisfies NavItem[],
} as const;

/** Map a URL path to its sub-nav section key. */
export function getSubNavKey(pathname: string): keyof typeof ROW_B | null {
  if (pathname.startsWith("/utilization")) return "utilization";
  if (pathname.startsWith("/efficiency")) return "efficiency";
  if (pathname.startsWith("/compliance")) return "compliance";
  if (pathname.startsWith("/forms")) return "forms";
  if (pathname.startsWith("/deep-dive")) return "deep-dive";
  return null;
}
