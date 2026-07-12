import type { ContentItem, Report, Section } from "@/lib/types";

/**
 * Indica se a geração de relatórios em runtime está disponível (IA + web
 * search conectados). Hoje é sempre `false` — a "pasta env" com a key será
 * ligada depois. Vira um checagem de env quando a integração existir.
 */
export function reportIsAvailable(): boolean {
  return false;
}

/**
 * Gera um relatório de dados reais (com fontes) para um bloco.
 *
 * STUB: hoje retorna `null` porque a IA/web search ainda não está conectada.
 * Enquanto isso, os relatórios são autorados via pesquisa por chat
 * (WebSearch/WebFetch) direto no frontmatter `report` do arquivo .md.
 *
 * TODO(ai): substituir por um agente com web search (AI SDK / Vercel AI
 * Gateway) que pesquisa fontes confiáveis, extrai dados e devolve um `Report`
 * — marcando metas/projeções com kind "meta"/"expectativa". Manter a
 * assinatura estável para a action e o botão não mudarem.
 */
export async function generateReport(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- parte da assinatura estável (usada quando a IA existir)
  section: Section,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- idem
  item: ContentItem
): Promise<Report | null> {
  return null;
}
