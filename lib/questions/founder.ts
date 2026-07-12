import type { SectionQuestions } from "./types";

/**
 * Seção Founder — "quem você é e para onde quer ir."
 * Perguntas reflexivas, genéricas o bastante para qualquer bloco da seção
 * (ex.: Objetivo, Estilo de vida). Serve de referência para as outras seções.
 */
export const founderQuestions: SectionQuestions = {
  intro:
    "Vamos capturar a visão por trás deste bloco — sem pressa, uma pergunta de cada vez.",
  coreQuestionId: "essencia",
  questions: [
    {
      id: "essencia",
      label: "Em uma frase, do que se trata este bloco?",
      help: "Resuma a ideia central com suas palavras.",
      type: "long",
      placeholder: "Ex.: Meu objetivo de negócio para os próximos 2 anos.",
    },
    {
      id: "porque",
      label: "Por que isso importa para você agora?",
      help: "A motivação de fundo — o que está em jogo.",
      type: "long",
    },
    {
      id: "sucesso",
      label: "Como é o sucesso aqui? Descreva o cenário ideal.",
      help: "Seja concreto: números, prazos, sensações.",
      type: "long",
    },
    {
      id: "metas",
      label: "Quais metas ou marcos você quer atingir?",
      help: "Liste 1–3 metas mensuráveis, se possível.",
      type: "long",
    },
    {
      id: "nao-negociaveis",
      label: "O que é inegociável para você neste caminho?",
      help: "Limites, valores e coisas das quais você não abre mão.",
      type: "long",
    },
    {
      id: "riscos",
      label: "Quais são os maiores riscos ou receios?",
      help: "O que pode dar errado ou te travar.",
      type: "long",
    },
    {
      id: "proximo-passo",
      label: "Qual é o próximo passo concreto?",
      help: "Uma ação clara para as próximas semanas.",
      type: "short",
    },
  ],
};
