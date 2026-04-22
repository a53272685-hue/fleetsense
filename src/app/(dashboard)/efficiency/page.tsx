import { redirect } from "next/navigation";

/** `/efficiency` → default to the overview sub-page. */
export default function EfficiencyIndexPage() {
  redirect("/efficiency/overview");
}
