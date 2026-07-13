import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const LEADS_ROOT = path.join(process.cwd(), "leads");

export type LeadStage =
  | "novo"
  | "contatado"
  | "qualificado"
  | "em-negociacao"
  | "ganho"
  | "perdido";

export const LEAD_STAGES: LeadStage[] = [
  "novo",
  "contatado",
  "qualificado",
  "em-negociacao",
  "ganho",
  "perdido",
];

export type LeadKind = "pessoa" | "empresa";

export interface LeadFrontmatter {
  id: string;
  name: string;
  role?: string;
  email?: string;
  company: string;
  /** Pessoa (CPF) ou empresa (CNPJ). Default: "pessoa". */
  kind?: LeadKind;
  /** Documento: CPF (pessoa) ou CNPJ (empresa). */
  document?: string;
  /** Nota curta sobre a empresa/contexto (aparece na lista). */
  companyNote?: string;
  /** Fonte do lead (ex.: LinkedIn, Indicação, Product Hunt). */
  source?: string;
  /** Como entrou (ex.: "prospector", "manual"). */
  via?: string;
  /** Aderência ao ICP, 0–100. */
  fit?: number;
  stage: LeadStage;
  /** Quando o lead entrou (ISO 8601). */
  enteredAt: string;
}

export interface Lead extends LeadFrontmatter {
  /** Observações longas (corpo markdown do arquivo). */
  notes: string;
}

function toLead(raw: string): Lead {
  const { data, content } = matter(raw);
  return { ...(data as LeadFrontmatter), notes: content.trim() };
}

function sortLeads(leads: Lead[]): Lead[] {
  return [...leads].sort(
    (a, b) => new Date(b.enteredAt).getTime() - new Date(a.enteredAt).getTime()
  );
}

export async function getAllLeads(): Promise<Lead[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(LEADS_ROOT);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  const files = entries.filter((e) => e.endsWith(".md"));
  const leads = await Promise.all(
    files.map(async (file) => toLead(await fs.readFile(path.join(LEADS_ROOT, file), "utf-8")))
  );
  return sortLeads(leads);
}

export async function getLeadById(id: string): Promise<Lead | null> {
  try {
    return toLead(await fs.readFile(path.join(LEADS_ROOT, `${id}.md`), "utf-8"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

/** Campos editáveis de um lead (id e enteredAt são preservados). */
export type LeadInput = Omit<LeadFrontmatter, "id" | "enteredAt"> & { notes?: string };

async function writeLead(fm: LeadFrontmatter, notes: string): Promise<Lead> {
  const clean = Object.fromEntries(
    Object.entries(fm).filter(([, v]) => v !== undefined && v !== "")
  ) as unknown as LeadFrontmatter;
  const fileContents = matter.stringify((notes ?? "").trim(), clean);
  await fs.mkdir(LEADS_ROOT, { recursive: true });
  await fs.writeFile(path.join(LEADS_ROOT, `${fm.id}.md`), fileContents, "utf-8");
  return { ...fm, notes: (notes ?? "").trim() };
}

export async function saveLead(id: string, input: LeadInput): Promise<Lead | null> {
  const existing = await getLeadById(id);
  if (!existing) return null;
  const { notes, ...rest } = input;
  return writeLead(
    { ...existing, ...rest, id, enteredAt: existing.enteredAt },
    notes ?? existing.notes
  );
}

function slugify(name: string): string {
  const base = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "lead";
}

export async function createLead(input: LeadInput): Promise<Lead> {
  const existing = new Set(
    (await getAllLeads()).map((l) => l.id)
  );
  const base = slugify(input.name);
  let id = base;
  let n = 2;
  while (existing.has(id)) {
    id = `${base}-${n}`;
    n += 1;
  }
  const { notes, ...rest } = input;
  return writeLead(
    { ...rest, id, enteredAt: new Date().toISOString() },
    notes ?? ""
  );
}

/** Atualiza apenas o estágio de um lead (usado pelo kanban de Oportunidades). */
export async function setLeadStage(id: string, stage: LeadStage): Promise<Lead | null> {
  const existing = await getLeadById(id);
  if (!existing) return null;
  const { notes, ...fm } = existing;
  return writeLead({ ...fm, stage }, notes);
}

export async function deleteLead(id: string): Promise<void> {
  try {
    await fs.unlink(path.join(LEADS_ROOT, `${id}.md`));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}
