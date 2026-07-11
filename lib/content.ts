import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import type { ContentFrontmatter, ContentItem, ContentStatus, Section } from "@/lib/types";

const CONTENT_ROOT = path.join(process.cwd(), "content");

// Itens que fisicamente moram em outra seção mas também devem aparecer
// aqui (spec 2.1): "oferta" é dono por "direcao" e referenciado por
// "validacao" sem ter uma cópia própria.
const SHARED_EXTRA_SLUGS: Partial<Record<Section, string[]>> = {
  validacao: ["oferta"],
};

// Regra especial (spec 2.1/4.2): "oferta" só existe fisicamente em
// content/direcao/oferta.md. A página de Validação referencia o mesmo
// arquivo em vez de ter sua própria cópia, então qualquer leitura/escrita
// pedida via section "validacao" + slug "oferta" é redirecionada aqui.
function resolveRelativePath(section: Section, slug: string): string {
  if (section === "validacao" && slug === "oferta") {
    return path.join("direcao", "oferta.md");
  }
  return path.join(section, `${slug}.md`);
}

function toContentItem(relativePath: string, raw: string): ContentItem {
  const { data, content } = matter(raw);
  return {
    frontmatter: data as ContentFrontmatter,
    body: content.trim(),
    filePath: relativePath.split(path.sep).join("/"),
  };
}

async function readContentFile(relativePath: string): Promise<ContentItem | null> {
  const absolutePath = path.join(CONTENT_ROOT, relativePath);
  try {
    const raw = await fs.readFile(absolutePath, "utf-8");
    return toContentItem(relativePath, raw);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

/** Slugs dos arquivos .md que existem fisicamente na pasta da seção. */
async function listOwnSlugs(section: Section): Promise<string[]> {
  try {
    const entries = await fs.readdir(path.join(CONTENT_ROOT, section));
    return entries
      .filter((entry) => entry.endsWith(".md"))
      .map((entry) => entry.slice(0, -".md".length));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

function sortItems(items: ContentItem[]): ContentItem[] {
  return [...items].sort((a, b) => {
    const orderA = a.frontmatter.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.frontmatter.order ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;
    return a.frontmatter.title.localeCompare(b.frontmatter.title, "pt-BR");
  });
}

function slugify(title: string): string {
  const slug = title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "bloco";
}

export async function getAllContent(): Promise<ContentItem[]> {
  const allPaths = await fs.readdir(CONTENT_ROOT, { recursive: true });
  const mdPaths = allPaths.filter((relativePath) => relativePath.endsWith(".md"));

  const items = await Promise.all(
    mdPaths.map(async (relativePath) => {
      const raw = await fs.readFile(path.join(CONTENT_ROOT, relativePath), "utf-8");
      return toContentItem(relativePath, raw);
    })
  );

  return items;
}

export async function getContentBySection(section: Section): Promise<ContentItem[]> {
  const ownSlugs = await listOwnSlugs(section);
  const extraSlugs = SHARED_EXTRA_SLUGS[section] ?? [];
  const slugs = [...new Set([...ownSlugs, ...extraSlugs])];

  const items = await Promise.all(
    slugs.map((slug) => getContentBySlug(section, slug))
  );

  return sortItems(items.filter((item): item is ContentItem => item !== null));
}

export async function getContentBySlug(
  section: Section,
  slug: string
): Promise<ContentItem | null> {
  const relativePath = resolveRelativePath(section, slug);
  return readContentFile(relativePath);
}

export async function saveContent(
  section: Section,
  slug: string,
  data: { frontmatter: Omit<ContentFrontmatter, "updatedAt">; body: string }
): Promise<ContentItem> {
  const relativePath = resolveRelativePath(section, slug);
  const absolutePath = path.join(CONTENT_ROOT, relativePath);

  const frontmatter: ContentFrontmatter = {
    ...data.frontmatter,
    updatedAt: new Date().toISOString(),
  };

  // js-yaml (used internally by gray-matter) can't dump explicit `undefined`
  // values, only missing keys — strip them before serializing.
  const cleanFrontmatter = Object.fromEntries(
    Object.entries(frontmatter).filter(([, value]) => value !== undefined)
  ) as ContentFrontmatter;

  const fileContents = matter.stringify(data.body, cleanFrontmatter);

  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, fileContents, "utf-8");

  return {
    frontmatter,
    body: data.body,
    filePath: relativePath.split(path.sep).join("/"),
  };
}

export type CreateContentInput = {
  title: string;
  status?: ContentStatus;
  tags?: string[];
  aiContext?: string;
  body?: string;
};

/**
 * Cria um novo bloco de conteúdo dentro de uma seção. Gera um slug único
 * a partir do título (com sufixo numérico em caso de colisão) e o coloca
 * no final da ordem de exibição da seção.
 */
export async function createContent(
  section: Section,
  input: CreateContentInput
): Promise<ContentItem> {
  const existingSlugs = new Set(await listOwnSlugs(section));
  const base = slugify(input.title);

  let slug = base;
  let suffix = 2;
  while (existingSlugs.has(slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  const existingItems = await getContentBySection(section);
  const maxOrder = existingItems.reduce(
    (max, item) => Math.max(max, item.frontmatter.order ?? 0),
    0
  );

  return saveContent(section, slug, {
    frontmatter: {
      title: input.title,
      section,
      slug,
      status: input.status ?? "rascunho",
      tags: input.tags ?? [],
      aiContext: input.aiContext,
      order: maxOrder + 1,
    },
    body: input.body ?? "",
  });
}

/** Exclui permanentemente o bloco de conteúdo (arquivo .md) do slug informado. */
export async function deleteContent(section: Section, slug: string): Promise<void> {
  const relativePath = resolveRelativePath(section, slug);
  const absolutePath = path.join(CONTENT_ROOT, relativePath);
  try {
    await fs.unlink(absolutePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}
