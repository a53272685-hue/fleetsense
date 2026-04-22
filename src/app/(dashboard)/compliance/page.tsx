import { redirect } from "next/navigation";

/** `/compliance` → default to the overview sub-page. */
export default function ComplianceIndexPage() {
  redirect("/compliance/overview");
}
