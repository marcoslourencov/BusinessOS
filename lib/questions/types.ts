export type QuestionType = "short" | "long" | "select";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  /** Id estável usado como chave em `frontmatter.answers`. Não mude depois de publicado. */
  id: string;
  /** A pergunta mostrada no passo do onboarding e como título no relatório. */
  label: string;
  /** Texto auxiliar/subtítulo que orienta a resposta. */
  help?: string;
  placeholder?: string;
  type: QuestionType;
  /** Somente para `type: "select"`. */
  options?: QuestionOption[];
}

export interface SectionQuestions {
  /** Enquadramento curto mostrado no início do onboarding desta seção. */
  intro: string;
  /** Perguntas ordenadas — uma por passo do onboarding. */
  questions: Question[];
  /**
   * Id da pergunta "núcleo" (narrativa principal). Na migração, o corpo
   * existente do bloco é colocado aqui para não perder nada.
   */
  coreQuestionId: string;
}
