"use server";

import { revalidatePath } from "next/cache";
import { saveLead, createLead, deleteLead, type LeadInput } from "@/lib/leads";

export async function saveLeadAction(id: string, input: LeadInput) {
  const saved = await saveLead(id, input);
  revalidatePath("/leads");
  return saved;
}

export async function createLeadAction(input: LeadInput) {
  const created = await createLead(input);
  revalidatePath("/leads");
  return created;
}

export async function deleteLeadAction(id: string) {
  await deleteLead(id);
  revalidatePath("/leads");
}
