import { redirect } from "next/navigation";

export default function PatientHistoryPage() {
  redirect("/dashboard/patient/records");
}
