"use server";

import { revalidatePath } from "next/cache";
import { setLeadStage, type LeadStage } from "@/lib/leads";

/** Move um lead para outro estágio (arrastar no kanban de Oportunidades). */
export async function moveLeadStageAction(id: string, stage: LeadStage) {
  await setLeadStage(id, stage);
  revalidatePath("/oportunidades");
  revalidatePath("/leads");
}
