import fs from "fs/promises";
import path from "path";
import { getCompletion } from "@/lib/briefing";
import {
  getAllContent,
  getContentBySlug,
  saveContent,
  createContent,
  deleteContent,
} from "@/lib/content";
import { getAllAgents, type Agent } from "@/lib/agents";
import type { ContentItem, Section } from "@/lib/types";

const BOARD_FILE = path.join(process.cwd(), "workflow", "board.json");

/** Estágios "padrão" carregam um `kind`, que sincroniza com o status do bloco. */
export type StageKind = "a-iniciar" | "em-progresso" | "aguardando" | "validado";

export interface Stage {
  id: string;
  label: string;
  description?: string;
  /** Presente só nas colunas padrão — dita a sincronia com o status do bloco. */
  kind?: StageKind;
}

export type BoardCard =
  | { id: string; type: "block"; section: Section; slug: string; stageId: string; order: number }
  | { id: string; type: "standalone"; title: string; agentId?: string; stageId: string; order: number };

interface BoardFile {
  stages: Stage[];
  cards: BoardCard[];
}

export const DEFAULT_STAGES: Stage[] = [
  { id: "a-iniciar", label: "A iniciar", description: "Sem conteúdo ainda.", kind: "a-iniciar" },
  { id: "em-progresso", label: "Em progresso", description: "Rascunho em construção.", kind: "em-progresso" },
  { id: "aguardando", label: "Aguardando você", description: "Proposta da IA para aprovar.", kind: "aguardando" },
  { id: "validado", label: "Validado", description: "Aprovado pelo founder.", kind: "validado" },
];

const STAGE_ICON: Record<StageKind, string> = {
  "a-iniciar": "CircleDashed",
  "em-progresso": "Loader",
  aguardando: "BellDot",
  validado: "CircleCheck",
};

/** Ícone de uma etapa (kind → lucide; custom → coluna genérica). */
export function stageIcon(stage: Stage): string {
  return stage.kind ? STAGE_ICON[stage.kind] : "Columns3";
}

function blockCardId(section: Section, slug: string): string {
  return `block:${section}/${slug}`;
}

// ---------------------------------------------------------------------------
// Persistência
// ---------------------------------------------------------------------------

async function readBoardFile(): Promise<BoardFile> {
  try {
    const raw = await fs.readFile(BOARD_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<BoardFile>;
    return {
      stages: parsed.stages?.length ? parsed.stages : DEFAULT_STAGES,
      cards: parsed.cards ?? [],
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { stages: DEFAULT_STAGES, cards: [] };
    }
    throw error;
  }
}

async function writeBoardFile(board: BoardFile): Promise<void> {
  await fs.mkdir(path.dirname(BOARD_FILE), { recursive: true });
  await fs.writeFile(BOARD_FILE, JSON.stringify(board, null, 2), "utf-8");
}

/** Lista as etapas atuais do quadro (usada pelas actions). */
export async function readBoardStages(): Promise<Stage[]> {
  const board = await readBoardFile();
  return board.stages;
}

// ---------------------------------------------------------------------------
// Agente responsável + estágio derivado
// ---------------------------------------------------------------------------

const MARCA_AGENT_BY_SLUG: Record<string, string> = {
  "big-idea": "cerne-plataforma",
  "posicionamento-x-y": "cerne-plataforma",
  icp: "cerne-plataforma",
  "tom-de-voz": "cerne-verbal",
  codigos: "cerne-visual",
};

/** Agente responsável por um bloco: slug → seção → mapa marca→CERNE. */
export function resolveAgent(item: ContentItem, agents: Agent[]): Agent | undefined {
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

/** Estágio padrão que corresponde ao status atual do bloco. */
function deriveDefaultStageId(item: ContentItem): StageKind {
  const fm = item.frontmatter;
  if (fm.status === "validado") return "validado";
  if (fm.review === "pendente") return "aguardando";
  const { answered } = getCompletion(fm.section, fm.answers ?? {});
  return answered > 0 ? "em-progresso" : "a-iniciar";
}

// ---------------------------------------------------------------------------
// Reconciliação + montagem do quadro
// ---------------------------------------------------------------------------

async function reconcile(): Promise<{ board: BoardFile; items: ContentItem[] }> {
  const [board, items] = await Promise.all([readBoardFile(), getAllContent()]);
  const stageIds = new Set(board.stages.map((s) => s.id));
  const firstStageId = board.stages[0]?.id ?? "a-iniciar";
  let dirty = false;

  const byId = new Map(board.cards.map((c) => [c.id, c]));
  const liveBlockIds = new Set(
    items.map((i) => blockCardId(i.frontmatter.section, i.frontmatter.slug))
  );

  // 1. Adiciona um card para cada bloco novo (no estágio derivado do status).
  for (const item of items) {
    const id = blockCardId(item.frontmatter.section, item.frontmatter.slug);
    if (byId.has(id)) continue;
    const stageId = deriveDefaultStageId(item);
    const order =
      board.cards.filter((c) => c.stageId === stageId).length;
    board.cards.push({
      id,
      type: "block",
      section: item.frontmatter.section,
      slug: item.frontmatter.slug,
      stageId,
      order,
    });
    dirty = true;
  }

  // 2. Remove cards de blocos que não existem mais.
  const kept = board.cards.filter((c) => {
    if (c.type === "block" && !liveBlockIds.has(c.id)) {
      dirty = true;
      return false;
    }
    return true;
  });
  if (kept.length !== board.cards.length) board.cards = kept;

  // 3. Cards em etapas inexistentes → primeira etapa.
  for (const c of board.cards) {
    if (!stageIds.has(c.stageId)) {
      c.stageId = firstStageId;
      dirty = true;
    }
  }

  if (dirty) await writeBoardFile(board);
  return { board, items };
}

export interface ResolvedCard {
  id: string;
  type: "block" | "standalone";
  title: string;
  stageId: string;
  order: number;
  section?: Section;
  slug?: string;
  agent?: { id: string; name: string; icon?: string };
  completion?: number;
}

export interface WorkflowColumn {
  stage: Stage;
  cards: ResolvedCard[];
}

export interface ActiveAgent {
  agent: { id: string; name: string; icon?: string };
  count: number;
}

export interface ResolvedBoard {
  columns: WorkflowColumn[];
  activeAgents: ActiveAgent[];
}

function agentLite(a?: Agent) {
  return a ? { id: a.id, name: a.name, icon: a.icon } : undefined;
}

export async function getResolvedBoard(): Promise<ResolvedBoard> {
  const [{ board, items }, agents] = await Promise.all([reconcile(), getAllAgents()]);
  const itemByKey = new Map(
    items.map((i) => [blockCardId(i.frontmatter.section, i.frontmatter.slug), i])
  );

  const resolved: ResolvedCard[] = [];
  for (const c of board.cards) {
    if (c.type === "block") {
      const item = itemByKey.get(c.id);
      if (!item) continue;
      const { pct } = getCompletion(item.frontmatter.section, item.frontmatter.answers ?? {});
      resolved.push({
        id: c.id,
        type: "block",
        title: item.frontmatter.title,
        stageId: c.stageId,
        order: c.order,
        section: c.section,
        slug: c.slug,
        agent: agentLite(resolveAgent(item, agents)),
        completion: pct,
      });
    } else {
      resolved.push({
        id: c.id,
        type: "standalone",
        title: c.title,
        stageId: c.stageId,
        order: c.order,
        agent: agentLite(agents.find((a) => a.id === c.agentId)),
      });
    }
  }

  const columns: WorkflowColumn[] = board.stages.map((stage) => ({
    stage,
    cards: resolved
      .filter((c) => c.stageId === stage.id)
      .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, "pt-BR")),
  }));

  // Agentes ativos = responsáveis por cards nas etapas kind "em-progresso".
  const progressStageIds = new Set(
    board.stages.filter((s) => s.kind === "em-progresso").map((s) => s.id)
  );
  const activeMap = new Map<string, ActiveAgent>();
  for (const c of resolved) {
    if (!progressStageIds.has(c.stageId) || !c.agent) continue;
    const cur = activeMap.get(c.agent.id);
    if (cur) cur.count += 1;
    else activeMap.set(c.agent.id, { agent: c.agent, count: 1 });
  }
  const activeAgents = [...activeMap.values()].sort(
    (a, b) => b.count - a.count || a.agent.name.localeCompare(b.agent.name, "pt-BR")
  );

  return { columns, activeAgents };
}

// ---------------------------------------------------------------------------
// Mutações (chamadas pelas server actions)
// ---------------------------------------------------------------------------

/** Sincroniza o status do bloco ao cair numa etapa padrão. */
async function syncBlockStatus(section: Section, slug: string, kind: StageKind): Promise<void> {
  const item = await getContentBySlug(section, slug);
  if (!item) return;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- excluído do restante preservado
  const { updatedAt, ...rest } = item.frontmatter;
  const next = { ...rest };
  if (kind === "validado") {
    next.status = "validado";
    next.review = undefined;
  } else if (kind === "aguardando") {
    if (next.status === "validado") next.status = "em-andamento";
    next.review = "pendente";
  } else if (kind === "em-progresso") {
    next.status = "em-andamento";
    next.review = undefined;
  } else {
    next.status = "rascunho";
    next.review = undefined;
  }
  await saveContent(section, slug, { frontmatter: next, body: item.body });
}

function reindex(cards: BoardCard[], stageId: string): void {
  cards
    .filter((c) => c.stageId === stageId)
    .sort((a, b) => a.order - b.order)
    .forEach((c, i) => {
      c.order = i;
    });
}

export async function moveCard(cardId: string, toStageId: string, toIndex: number): Promise<void> {
  const board = await readBoardFile();
  const card = board.cards.find((c) => c.id === cardId);
  const target = board.stages.find((s) => s.id === toStageId);
  if (!card || !target) return;

  const fromStageId = card.stageId;
  // Abre espaço no destino no índice pedido.
  board.cards
    .filter((c) => c.stageId === toStageId && c.id !== cardId)
    .sort((a, b) => a.order - b.order)
    .forEach((c, i) => {
      c.order = i >= toIndex ? i + 1 : i;
    });
  card.stageId = toStageId;
  card.order = toIndex;

  reindex(board.cards, toStageId);
  if (fromStageId !== toStageId) reindex(board.cards, fromStageId);

  await writeBoardFile(board);

  // Sincroniza status se caiu numa etapa padrão (só para cards-bloco).
  if (card.type === "block" && target.kind) {
    await syncBlockStatus(card.section, card.slug, target.kind);
  }
}

export type CreateCardInput =
  | { type: "standalone"; stageId: string; title: string; agentId?: string }
  | { type: "block"; stageId: string; section: Section; title: string };

export async function createCard(input: CreateCardInput): Promise<void> {
  const board = await readBoardFile();
  const target = board.stages.find((s) => s.id === input.stageId) ?? board.stages[0];
  if (!target) return;
  const order = board.cards.filter((c) => c.stageId === target.id).length;

  if (input.type === "standalone") {
    board.cards.push({
      id: `sa-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      type: "standalone",
      title: input.title.trim() || "Novo card",
      agentId: input.agentId,
      stageId: target.id,
      order,
    });
    await writeBoardFile(board);
    return;
  }

  // Bloco real: cria o arquivo de conteúdo e adiciona o card correspondente.
  const created = await createContent(input.section, { title: input.title });
  const id = blockCardId(input.section, created.frontmatter.slug);
  board.cards.push({
    id,
    type: "block",
    section: input.section,
    slug: created.frontmatter.slug,
    stageId: target.id,
    order,
  });
  await writeBoardFile(board);
  if (target.kind) await syncBlockStatus(input.section, created.frontmatter.slug, target.kind);
}

export async function deleteCard(cardId: string): Promise<void> {
  const board = await readBoardFile();
  const card = board.cards.find((c) => c.id === cardId);
  if (!card) return;
  board.cards = board.cards.filter((c) => c.id !== cardId);
  await writeBoardFile(board);
  if (card.type === "block") await deleteContent(card.section, card.slug);
}

export async function addStage(label: string): Promise<void> {
  const board = await readBoardFile();
  board.stages.push({
    id: `stage-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    label: label.trim() || "Nova etapa",
  });
  await writeBoardFile(board);
}

export async function renameStage(stageId: string, label: string): Promise<void> {
  const board = await readBoardFile();
  const stage = board.stages.find((s) => s.id === stageId);
  if (!stage) return;
  stage.label = label.trim() || stage.label;
  await writeBoardFile(board);
}

/** Remove uma etapa custom (as padrão, com `kind`, não podem ser removidas). */
export async function deleteStage(stageId: string): Promise<void> {
  const board = await readBoardFile();
  const stage = board.stages.find((s) => s.id === stageId);
  if (!stage || stage.kind) return; // não remove etapas padrão
  const firstDefault = board.stages.find((s) => s.kind === "a-iniciar")?.id
    ?? board.stages.find((s) => s.id !== stageId)?.id;
  // Cards da etapa removida vão para a primeira etapa padrão.
  for (const c of board.cards) {
    if (c.stageId === stageId && firstDefault) c.stageId = firstDefault;
  }
  board.stages = board.stages.filter((s) => s.id !== stageId);
  await writeBoardFile(board);
}
