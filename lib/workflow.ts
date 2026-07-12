import { getCompletion } from "@/lib/briefing";
import type { Agent } from "@/lib/agents";
import type { ContentItem } from "@/lib/types";

export type WorkflowStage =
  | "a-iniciar"
  | "em-progresso"
  | "aguardando"
  | "validado";

export interface StageMeta {
  id: WorkflowStage;
  label: string;
  description: string;
  /** Nome de ícone lucide, resolvido na UI. */
  icon: string;
}

/** Colunas do quadro, na ordem de exibição. */
export const STAGES: StageMeta[] = [
  { id: "a-iniciar", label: "A iniciar", description: "Sem conteúdo ainda.", icon: "CircleDashed" },
  { id: "em-progresso", label: "Em progresso", description: "Rascunho em construção.", icon: "Loader" },
  { id: "aguardando", label: "Aguardando você", description: "Proposta da IA para aprovar.", icon: "BellDot" },
  { id: "validado", label: "Validado", description: "Aprovado pelo founder.", icon: "CircleCheck" },
];

/** Blocos de marca não têm agente dedicado — mapeados à squad CERNE. */
const MARCA_AGENT_BY_SLUG: Record<string, string> = {
  "big-idea": "cerne-plataforma",
  "posicionamento-x-y": "cerne-plataforma",
  icp: "cerne-plataforma",
  "tom-de-voz": "cerne-verbal",
  codigos: "cerne-visual",
};

/**
 * Encontra o agente responsável por um bloco: primeiro por slug exato,
 * depois por seção, depois pelo mapa curado de marca → CERNE. Retorna
 * `undefined` quando não há agente dedicado (ex.: autoridade).
 */
export function resolveAgent(
  item: ContentItem,
  agents: Agent[]
): Agent | undefined {
  const { section, slug } = item.frontmatter;

  const bySlug = agents.find((a) => a.slug === slug);
  if (bySlug) return bySlug;

  const bySection = agents.find((a) => a.section === section);
  if (bySection) return bySection;

  if (section === "marca") {
    const id = MARCA_AGENT_BY_SLUG[slug];
    if (id) return agents.find((a) => a.id === id);
  }

  return undefined;
}

/** Deriva o estágio de workflow de um bloco (precedência: validado → aguardando → em-progresso → a-iniciar). */
export function getBlockStage(item: ContentItem): WorkflowStage {
  const fm = item.frontmatter;
  if (fm.status === "validado") return "validado";
  if (fm.review === "pendente") return "aguardando";
  const { answered } = getCompletion(fm.section, fm.answers ?? {});
  return answered > 0 ? "em-progresso" : "a-iniciar";
}

export interface WorkflowCard {
  item: ContentItem;
  stage: WorkflowStage;
  agent?: Agent;
  /** Completude (0–100) do bloco. */
  completion: number;
}

export interface WorkflowColumn extends StageMeta {
  cards: WorkflowCard[];
}

export interface ActiveAgent {
  agent: Agent;
  /** Nº de cards em "Em progresso" sob responsabilidade do agente. */
  count: number;
}

export interface WorkflowBoard {
  columns: WorkflowColumn[];
  activeAgents: ActiveAgent[];
}

/** Monta o quadro completo a partir dos blocos e agentes. */
export function buildBoard(items: ContentItem[], agents: Agent[]): WorkflowBoard {
  const cards: WorkflowCard[] = items.map((item) => {
    const { pct } = getCompletion(item.frontmatter.section, item.frontmatter.answers ?? {});
    return {
      item,
      stage: getBlockStage(item),
      agent: resolveAgent(item, agents),
      completion: pct,
    };
  });

  const columns: WorkflowColumn[] = STAGES.map((stage) => ({
    ...stage,
    cards: cards
      .filter((c) => c.stage === stage.id)
      .sort((a, b) =>
        a.item.frontmatter.title.localeCompare(b.item.frontmatter.title, "pt-BR")
      ),
  }));

  // Agentes ativos = responsáveis por ≥1 card em progresso.
  const activeMap = new Map<string, ActiveAgent>();
  for (const card of cards) {
    if (card.stage !== "em-progresso" || !card.agent) continue;
    const existing = activeMap.get(card.agent.id);
    if (existing) existing.count += 1;
    else activeMap.set(card.agent.id, { agent: card.agent, count: 1 });
  }
  const activeAgents = [...activeMap.values()].sort(
    (a, b) => b.count - a.count || a.agent.name.localeCompare(b.agent.name, "pt-BR")
  );

  return { columns, activeAgents };
}
