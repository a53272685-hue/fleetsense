import { redirect } from "next/navigation";

/**
 * When a user hits /utilization/vehicle-deep-dive directly (e.g. from the
 * sub-nav tab), send them to a default vehicle detail so the page is never
 * empty. A real app would resolve this from the most-recently-viewed vehicle
 * or the current fleet context.
 */
export default function VehicleDeepDiveIndexPage() {
  redirect("/utilization/vehicle-deep-dive/1");
}
