"use server";

import { revalidatePath } from "next/cache";
import { saveContent } from "@/lib/content";
import { answersToBody, composeBriefing } from "@/lib/briefing";
import type { ContentFrontmatter, Section } from "@/lib/types";

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

  const pathsToRevalidate = new Set<string>([
    `/${section}`,
    `/${section}/${slug}`,
    `/${saved.frontmatter.section}`,
    `/${saved.frontmatter.section}/${slug}`,
  ]);

  for (const shared of saved.frontmatter.sharedWith ?? []) {
    pathsToRevalidate.add(`/${shared}`);
    pathsToRevalidate.add(`/${shared}/${slug}`);
  }

  for (const p of pathsToRevalidate) {
    revalidatePath(p);
  }

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

  const pathsToRevalidate = new Set<string>([
    `/${section}`,
    `/${section}/${slug}`,
    `/${saved.frontmatter.section}`,
    `/${saved.frontmatter.section}/${slug}`,
  ]);

  for (const shared of saved.frontmatter.sharedWith ?? []) {
    pathsToRevalidate.add(`/${shared}`);
    pathsToRevalidate.add(`/${shared}/${slug}`);
  }

  for (const p of pathsToRevalidate) {
    revalidatePath(p);
  }

  return saved;
}
