import type { SectionQuestions } from "./types";

/**
 * Seção Marca — "Identidade, tom de voz e posicionamento."
 * Da ideia central ao próximo passo: define quem é a marca, para quem ela
 * fala, o que promete e como soa e aparece no mundo.
 */
export const marcaQuestions: SectionQuestions = {
  intro:
    "Vamos dar forma à identidade da marca — a ideia central, quem ela serve e como ela soa.",
  coreQuestionId: "essencia",
  questions: [
    {
      id: "essencia",
      label: "Em uma frase, qual é a grande ideia por trás desta marca?",
      help: "A ideia central que amarra tudo o resto. Escreva com suas palavras.",
      type: "long",
      placeholder:
        "Ex.: Tornar a gestão financeira algo simples e até prazeroso para quem odeia planilhas.",
    },
    {
      id: "posicionamento",
      label: "Para quem esta marca existe — e contra o quê ela se posiciona?",
      help: "O lugar que você quer ocupar na cabeça das pessoas. Diga o que você defende e o que você rejeita.",
      type: "long",
      placeholder:
        "Ex.: Para founders solo; contra a ideia de que crescer exige um time enorme.",
    },
    {
      id: "publico",
      label: "Quem é o público que você quer atrair e servir?",
      help: "Descreva a pessoa real: contexto, dores, desejos e como ela fala.",
      type: "long",
    },
    {
      id: "promessa",
      label: "Qual é a promessa central — a proposta de valor que só você entrega?",
      help: "O que muda na vida de quem escolhe você. Seja específico e verificável.",
      type: "long",
    },
    {
      id: "tom-de-voz",
      label: "Como esta marca soa quando fala?",
      help: "Descreva o tom em 3–4 adjetivos e dê um exemplo de frase que soa como a marca.",
      type: "long",
      placeholder: "Ex.: Direto, caloroso, sem jargão. \"A gente resolve, você respira.\"",
    },
    {
      id: "codigos",
      label: "Quais são os códigos verbais e visuais que identificam a marca?",
      help: "Palavras e expressões recorrentes, cores, tipografia, símbolos — o que faz reconhecerem você de longe.",
      type: "long",
    },
    {
      id: "prova",
      label: "O que dá credibilidade a essa promessa hoje?",
      help: "Resultados, história, bastidores ou provas que sustentam o discurso.",
      type: "long",
    },
    {
      id: "proximo-passo",
      label: "Qual é o próximo passo concreto para fortalecer a marca?",
      help: "Uma ação clara para as próximas semanas.",
      type: "short",
    },
  ],
};
