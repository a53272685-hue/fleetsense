import { redirect } from "next/navigation";

/** `/efficiency/driver-deep-dive` → default to driver id 1. */
export default function DriverDeepDiveIndexPage() {
  redirect("/efficiency/driver-deep-dive/1");
}
