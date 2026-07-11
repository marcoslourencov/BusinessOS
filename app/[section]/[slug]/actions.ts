"use server";

import { revalidatePath } from "next/cache";
import { saveContent } from "@/lib/content";
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
