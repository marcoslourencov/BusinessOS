import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import type { Section } from "@/lib/types";

const AGENTS_ROOT = path.join(process.cwd(), "agents");

export type AgentCategory = "cerne" | "secao" | "utilitario";

export interface AgentFrontmatter {
  id: string;
  name: string;
  description: string;
  category: AgentCategory;
  /** Nome de um ícone lucide-react (ex.: "Compass"). Resolvido na UI. */
  icon?: string;
  /** Seção do BusinessOS à qual o agente se vincula (opcional). */
  section?: Section;
  /** Bloco específico ao qual o agente se vincula (opcional). */
  slug?: string;
  /** Ordem de exibição dentro da categoria (menor = primeiro). */
  order?: number;
}

export interface Agent extends AgentFrontmatter {
  /** System prompt do agente (corpo markdown do arquivo). */
  systemPrompt: string;
}

/** Ordem de exibição das categorias na página de Agentes. */
const CATEGORY_ORDER: Record<AgentCategory, number> = {
  cerne: 0,
  secao: 1,
  utilitario: 2,
};

function toAgent(raw: string): Agent {
  const { data, content } = matter(raw);
  const fm = data as AgentFrontmatter;
  return { ...fm, systemPrompt: content.trim() };
}

function sortAgents(agents: Agent[]): Agent[] {
  return [...agents].sort((a, b) => {
    const catA = CATEGORY_ORDER[a.category] ?? Number.MAX_SAFE_INTEGER;
    const catB = CATEGORY_ORDER[b.category] ?? Number.MAX_SAFE_INTEGER;
    if (catA !== catB) return catA - catB;
    const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;
    return a.name.localeCompare(b.name, "pt-BR");
  });
}

export async function getAllAgents(): Promise<Agent[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(AGENTS_ROOT);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  const mdFiles = entries.filter((e) => e.endsWith(".md"));
  const agents = await Promise.all(
    mdFiles.map(async (file) => {
      const raw = await fs.readFile(path.join(AGENTS_ROOT, file), "utf-8");
      return toAgent(raw);
    })
  );
  return sortAgents(agents);
}

export async function getAgentById(id: string): Promise<Agent | null> {
  try {
    const raw = await fs.readFile(path.join(AGENTS_ROOT, `${id}.md`), "utf-8");
    return toAgent(raw);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export type SaveAgentInput = {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
};

/**
 * Persiste as edições de um agente (name/description/systemPrompt),
 * preservando o restante do frontmatter (category, icon, section, slug, order).
 * Espelha `saveContent` em lib/content.ts.
 */
export async function saveAgent(input: SaveAgentInput): Promise<Agent> {
  const absolutePath = path.join(AGENTS_ROOT, `${input.id}.md`);
  const raw = await fs.readFile(absolutePath, "utf-8");
  const { data } = matter(raw);

  const frontmatter: AgentFrontmatter = {
    ...(data as AgentFrontmatter),
    id: input.id,
    name: input.name,
    description: input.description,
  };

  // js-yaml (via gray-matter) não serializa `undefined` — remova essas chaves.
  const clean = Object.fromEntries(
    Object.entries(frontmatter).filter(([, v]) => v !== undefined)
  ) as unknown as AgentFrontmatter;

  const fileContents = matter.stringify(input.systemPrompt.trim(), clean);
  await fs.writeFile(absolutePath, fileContents, "utf-8");

  return { ...frontmatter, systemPrompt: input.systemPrompt.trim() };
}
