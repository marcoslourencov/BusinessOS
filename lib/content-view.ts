import type { ContentItem, Section } from "@/lib/types";
import type { ContentGridItem } from "@/components/content-grid";

const EXCERPT_MAX_LENGTH = 160;

function truncate(body: string): string {
  const flat = body.replace(/\s+/g, " ").trim();
  if (flat.length <= EXCERPT_MAX_LENGTH) return flat;
  return `${flat.slice(0, EXCERPT_MAX_LENGTH).trimEnd()}…`;
}

/**
 * Maps a ContentItem (real data shape, with nested frontmatter) to the flat
 * props shape expected by ContentCard/ContentGrid, for a given route section.
 *
 * Note: `routeSection` (the section the user is currently browsing) is used
 * to build the `href`, which may differ from `item.frontmatter.section` for
 * shared items like "oferta" (physically owned by "direcao" but also
 * rendered under "/validacao").
 */
export function toContentGridItem(
  item: ContentItem,
  routeSection: Section
): ContentGridItem {
  return {
    id: item.frontmatter.slug,
    title: item.frontmatter.title,
    status: item.frontmatter.status,
    updatedAt: item.frontmatter.updatedAt,
    excerpt: truncate(item.body),
    tags: item.frontmatter.tags,
    href: `/${routeSection}/${item.frontmatter.slug}`,
    section: routeSection,
    slug: item.frontmatter.slug,
    group: item.frontmatter.group,
  };
}

export function toContentGridItems(
  items: ContentItem[],
  routeSection: Section
): ContentGridItem[] {
  return items.map((item) => toContentGridItem(item, routeSection));
}
