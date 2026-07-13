import { getAllLeads } from "@/lib/leads";
import { OpportunitiesBoard } from "@/components/opportunities-board";

export default async function OportunidadesPage() {
  const leads = await getAllLeads();
  return <OpportunitiesBoard leads={leads} />;
}
