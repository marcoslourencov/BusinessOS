"use server";

import { revalidatePath } from "next/cache";
import { getContentBySlug, saveContent } from "@/lib/content";
import { answersToBody, composeBriefing } from "@/lib/briefing";
import { generateReport } from "@/lib/report";
import type { ContentFrontmatter, Section } from "@/lib/types";

/** Revalida a rota da seção/slug + qualquer seção em `sharedWith`. */
function revalidateContentPaths(
  section: Section,
  slug: string,
  saved: { frontmatter: ContentFrontmatter }
) {
  const paths = new Set<string>([
    `/${section}`,
    `/${section}/${slug}`,
    `/${saved.frontmatter.section}`,
    `/${saved.frontmatter.section}/${slug}`,
  ]);
  for (const shared of saved.frontmatter.sharedWith ?? []) {
    paths.add(`/${shared}`);
    paths.add(`/${shared}/${slug}`);
  }
  for (const p of paths) revalidatePath(p);
}

export type SaveItemInput = {
  section: Section;
  slug: string;
  frontmatter: Omit<ContentFrontmatter, "updatedAt">;
  body: string;
};

/**
 * Persists an edited content item and revalidates every route that could be
 * displaying it. This is generic on purpose: shared items (like "oferta",
 * owned by "direcao" but also rendered under "/validacao" per sharedWith)
 * get their owning section and every section listed in sharedWith
 * revalidated too, without hardcoding any specific slug here.
 */
export async function saveItemAction(input: SaveItemInput) {
  const { section, slug, frontmatter, body } = input;

  const saved = await saveContent(section, slug, { frontmatter, body });

  revalidateContentPaths(section, slug, saved);

  return saved;
}

export type SaveBlockContentInput = {
  section: Section;
  slug: string;
  /**
   * Frontmatter completo (menos os campos gerados/derivados). Deve incluir as
   * `answers` do onboarding além de title/status/tags/aiContext e quaisquer
   * campos preservados (order, group, relatedSlugs, sharedWith, etc.).
   */
  frontmatter: Omit<
    ContentFrontmatter,
    "updatedAt" | "briefing" | "briefingGeneratedAt"
  >;
};

/**
 * Persiste as respostas do onboarding de um bloco e (re)gera o briefing +
 * o corpo derivado. A geração do briefing acontece no servidor — é aqui que
 * o Claude entra no futuro (ver lib/briefing.composeBriefing).
 */
export async function saveBlockContentAction(input: SaveBlockContentInput) {
  const { section, slug, frontmatter } = input;
  const answers = frontmatter.answers ?? {};

  const briefing = composeBriefing(section, answers);
  const body = answersToBody(section, answers);

  const saved = await saveContent(section, slug, {
    frontmatter: {
      ...frontmatter,
      answers,
      briefing,
      briefingGeneratedAt: new Date().toISOString(),
    },
    body,
  });

  revalidateContentPaths(section, slug, saved);

  return saved;
}

export type GenerateReportResult =
  | { status: "generated" }
  | { status: "pending" }
  | { status: "not-found" };

/**
 * (Re)gera o relatório de dados reais de um bloco. A geração é a *seam* de IA
 * (ver lib/report.generateReport). Enquanto a IA/web search não está conectada,
 * `generateReport` devolve `null` e esta action é um no-op — nunca sobrescreve
 * um `report` já autorado via chat.
 */
export async function generateReportAction(
  section: Section,
  slug: string
): Promise<GenerateReportResult> {
  const item = await getContentBySlug(section, slug);
  if (!item) return { status: "not-found" };

  const report = await generateReport(section, item);
  if (!report) return { status: "pending" };

  // Preserva todo o frontmatter existente (answers/briefing intocados);
  // `updatedAt` é regerado dentro de saveContent.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- excluído do restante preservado
  const { updatedAt, ...rest } = item.frontmatter;
  const saved = await saveContent(section, slug, {
    frontmatter: { ...rest, report },
    body: item.body,
  });

  revalidateContentPaths(section, slug, saved);

  return { status: "generated" };
}
