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
  { label: "Efficiency", href: "/efficiency", icon: NavEfficiencyIcon },
  { label: "Compliance", href: "/compliance", icon: NavComplianceIcon },
  { label: "Forms", href: "/forms", icon: NavFormsIcon },
  { label: "Deep Dive", href: "/deep-dive", icon: NavDeepDiveIcon },
];

export const ROW_B = {
  utilization: [
    { label: "Overview", href: "/utilization/overview" },
    { label: "Activity", href: "/utilization/activity" },
    { label: "Vehicle Deep Dive", href: "/utilization/vehicle-deep-dive" },
    { label: "Group Compare", href: "/utilization/group-comparison" },
  ] satisfies NavItem[],
} as const;

/** Map a URL path to its sub-nav section key. */
export function getSubNavKey(pathname: string): keyof typeof ROW_B | null {
  if (pathname.startsWith("/utilization")) return "utilization";
  return null;
}
