"use server";

import { revalidatePath } from "next/cache";
import { getContentBySlug, saveContent } from "@/lib/content";
import type { Section } from "@/lib/types";

export type ApproveResult = { status: "approved" } | { status: "not-found" };

/**
 * Aprova a proposta de um bloco: marca como `validado` e remove o estado
 * `review: "pendente"`, movendo o card de "Aguardando você" para "Validado".
 * Preserva todo o resto do frontmatter (answers, briefing, report, etc.).
 */
export async function approveBlockAction(
  section: Section,
  slug: string
): Promise<ApproveResult> {
  const item = await getContentBySlug(section, slug);
  if (!item) return { status: "not-found" };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- excluído do restante preservado
  const { updatedAt, ...rest } = item.frontmatter;
  const saved = await saveContent(section, slug, {
    frontmatter: { ...rest, status: "validado", review: undefined },
    body: item.body,
  });

  const paths = new Set<string>([
    "/workflow",
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

  return { status: "approved" };
}
