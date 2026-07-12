export type Section =
  | "founder"
  | "direcao"
  | "validacao"
  | "caixa"
  | "marca"
  | "autoridade";

export type ContentStatus = "rascunho" | "em-andamento" | "validado";

/**
 * Natureza de um dado dentro de um relatório:
 * - `fato`: dado real, verificável, com fonte confiável;
 * - `meta`: objetivo definido pelo founder (não é um fato do mercado);
 * - `expectativa`: projeção/estimativa (nossa ou de terceiros), não confirmada.
 */
export type DataKind = "fato" | "meta" | "expectativa";

/** Fonte citável que embasa um dado do relatório. */
export interface ReportSource {
  title: string;
  url: string;
  publisher?: string; // ex.: "Sebrae", "IBGE"
  publishedAt?: string; // ISO 8601 ou ano ("2025")
}

/** Um dado do relatório, com sua natureza e as fontes que o embasam. */
export interface ReportFinding {
  label: string; // ex.: "Tamanho do mercado (SAM)"
  value: string; // ex.: "~R$ 2,4 bi/ano"
  kind: DataKind;
  detail?: string; // narrativa curta
  /** Índices em `Report.sources` que embasam este dado. */
  sourceIndexes?: number[];
}

/**
 * Relatório de dados reais de um bloco. Populado hoje via pesquisa por chat
 * (WebSearch/WebFetch) e, no futuro, por IA em runtime. Ver lib/report.ts.
 */
export interface Report {
  summary?: string; // síntese executiva (mesmo formato markdown-ish do briefing)
  findings: ReportFinding[];
  sources: ReportSource[];
  generatedAt: string; // ISO 8601
  generatedBy?: string; // "claude-web-research" (chat) | model id (futuro)
}

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
  /** Relatório de dados reais com fontes. Ver Report e lib/report.ts. */
  report?: Report;
}

export interface ContentItem {
  frontmatter: ContentFrontmatter;
  body: string; // corpo em Markdown, sem o frontmatter
  filePath: string; // caminho relativo dentro de content/, ex. "direcao/oferta.md"
}
