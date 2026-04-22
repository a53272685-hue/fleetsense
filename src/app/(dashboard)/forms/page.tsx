import { redirect } from "next/navigation";

/** `/forms` → default to the submissions sub-page. */
export default function FormsIndexPage() {
  redirect("/forms/submissions");
}
