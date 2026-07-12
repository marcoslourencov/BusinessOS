export type Section =
  | "founder"
  | "direcao"
  | "validacao"
  | "caixa"
  | "marca"
  | "autoridade";

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
  /** Posição manual de exibição dentro da seção (menor = primeiro). Blocos sem este campo vão para o final, ordenados por título. */
  order?: number;
  /** Rótulo opcional de agrupamento visual dentro da seção (ex.: "Editorias"). Itens sem este campo aparecem soltos, sem cabeçalho de grupo. */
  group?: string;
  /** Respostas estruturadas do onboarding, indexadas pelo id da pergunta (ver lib/questions). */
  answers?: Record<string, string>;
  /** Briefing (markdown) gerado a partir das respostas. Ver lib/briefing. */
  briefing?: string;
  /** Quando o briefing foi gerado pela última vez (ISO 8601). */
  briefingGeneratedAt?: string;
}

export interface ContentItem {
  frontmatter: ContentFrontmatter;
  body: string; // corpo em Markdown, sem o frontmatter
  filePath: string; // caminho relativo dentro de content/, ex. "direcao/oferta.md"
}
