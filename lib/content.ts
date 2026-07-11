import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import type { ContentFrontmatter, ContentItem, Section } from "@/lib/types";

const CONTENT_ROOT = path.join(process.cwd(), "content");

const SECTION_ORDER: Record<Section, string[]> = {
  founder: ["objetivo", "estilo-de-vida"],
  direcao: [
    "mapa-do-mercado",
    "mapa-de-problemas",
    "perfil-ideal-de-cliente",
    "tese-de-valor",
    "oferta",
  ],
  validacao: ["oferta", "primeiros-clientes"],
  caixa: ["fluxo-de-caixa", "erp"],
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
  const slugs = SECTION_ORDER[section];
  const items = await Promise.all(
    slugs.map((slug) => getContentBySlug(section, slug))
  );
  return items.filter((item): item is ContentItem => item !== null);
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

  const fileContents = matter.stringify(data.body, frontmatter);

  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, fileContents, "utf-8");

  return {
    frontmatter,
    body: data.body,
    filePath: relativePath.split(path.sep).join("/"),
  };
}
