"use server";

import { revalidatePath } from "next/cache";
import { createContent, deleteContent, getContentBySlug } from "@/lib/content";
import type { Section } from "@/lib/types";

export async function createBlockAction(section: Section, title: string) {
  const created = await createContent(section, { title });
  revalidatePath(`/${section}`);
  return created;
}

/**
 * Exclui um bloco de conteúdo. Genérico de propósito: itens compartilhados
 * (como "oferta", dono por "direcao" mas também exibido em "/validacao" via
 * sharedWith) revalidam a seção dona e todas as seções listadas em
 * sharedWith, sem precisar de um caso especial aqui.
 */
export async function deleteBlockAction(section: Section, slug: string) {
  const item = await getContentBySlug(section, slug);

  await deleteContent(section, slug);

  const pathsToRevalidate = new Set<string>([`/${section}`, `/${section}/${slug}`]);
  if (item) {
    pathsToRevalidate.add(`/${item.frontmatter.section}`);
    for (const shared of item.frontmatter.sharedWith ?? []) {
      pathsToRevalidate.add(`/${shared}`);
    }
  }

  for (const p of pathsToRevalidate) {
    revalidatePath(p);
  }
}
