import { redirect } from "next/navigation";

/** `/deep-dive` → default to the drivers sub-page. */
export default function DeepDiveIndexPage() {
  redirect("/deep-dive/drivers");
}
