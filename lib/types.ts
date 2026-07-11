export type Section = "founder" | "direcao" | "validacao" | "caixa";

export type ContentStatus = "rascunho" | "em-andamento" | "validado";

export interface ContentFrontmatter {
  title: string;
  section: Section;
  slug: string;
  status: ContentStatus;
  updatedAt: string; // ISO 8601
  tags: string[];
  aiContext?: string;
  sharedWith?: Section[];
  validationStage?: "nao-testada" | "em-teste" | "validada" | "invalidada";
  relatedSlugs?: string[];
  period?: string;
}

export interface ContentItem {
  frontmatter: ContentFrontmatter;
  body: string; // corpo em Markdown, sem o frontmatter
  filePath: string; // caminho relativo dentro de content/, ex. "direcao/oferta.md"
}
