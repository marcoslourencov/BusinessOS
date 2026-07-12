import type { Section } from "@/lib/types";
import type { SectionQuestions } from "./types";
import { founderQuestions } from "./founder";
import { direcaoQuestions } from "./direcao";
import { validacaoQuestions } from "./validacao";
import { caixaQuestions } from "./caixa";
import { marcaQuestions } from "./marca";
import { autoridadeQuestions } from "./autoridade";

export const SECTION_QUESTIONS: Record<Section, SectionQuestions> = {
  founder: founderQuestions,
  direcao: direcaoQuestions,
  validacao: validacaoQuestions,
  caixa: caixaQuestions,
  marca: marcaQuestions,
  autoridade: autoridadeQuestions,
};

export function getSectionQuestions(section: Section): SectionQuestions {
  return SECTION_QUESTIONS[section];
}

export * from "./types";
