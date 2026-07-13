import { getAllLeads } from "@/lib/leads";
import { LeadsView } from "@/components/leads-view";

export default async function LeadsPage() {
  const leads = await getAllLeads();
  return <LeadsView leads={leads} />;
}
