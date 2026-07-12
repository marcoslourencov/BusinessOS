"use server";

import { revalidatePath } from "next/cache";
import { saveAgent, type SaveAgentInput } from "@/lib/agents";

/**
 * Persiste as edições de um agente (name/description/system prompt) e
 * revalida a página de Agentes. A geração por IA usará o system prompt salvo
 * aqui quando a integração de runtime existir (ver lib/report.ts).
 */
export async function saveAgentAction(input: SaveAgentInput) {
  const saved = await saveAgent(input);
  revalidatePath("/agentes");
  return saved;
}
